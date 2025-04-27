import cv2
import numpy as np
from multiprocessing import Pool
import base64
import json
import sys

def process_chunk(args):
    chunk_indices, descriptors, keypoints_info, max_dist = args
    out_point_list = []
    
    for index_dis in chunk_indices:
        for index_ic in range(index_dis + 1, len(keypoints_info)):
            point1_x = int(round(keypoints_info[index_dis][0]))
            point1_y = int(round(keypoints_info[index_dis][1]))
            point2_x = int(round(keypoints_info[index_ic][0]))
            point2_y = int(round(keypoints_info[index_ic][1]))

            if point1_x == point2_x and point1_y == point2_y:
                continue

            dist = np.linalg.norm(descriptors[index_dis] - descriptors[index_ic])

            if dist < max_dist:
                out_point_list.append([
                    point1_x, point1_y,
                    point2_x, point2_y
                ])
    return out_point_list if out_point_list else None

def detect_copy_move(image_path, resize_percentage=100, max_dist=150, nprocs=12):
    try:
        # Read images
        img_gray = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        img_rgb = cv2.imread(image_path, cv2.IMREAD_COLOR)

        if img_gray is None or img_rgb is None:
            raise ValueError("Failed to read the image. Check the image path.")

        # Resize image if needed
        if resize_percentage != 100:
            img_gray = cv2.resize(img_gray, (
                int(img_gray.shape[1] * resize_percentage / 100),
                int(img_gray.shape[0] * resize_percentage / 100)))
            img_rgb = cv2.resize(img_rgb, (
                int(img_rgb.shape[1] * resize_percentage / 100),
                int(img_rgb.shape[0] * resize_percentage / 100)))

        # Initialize SIFT
        sift = cv2.SIFT_create()
        keypoints_sift, descriptors = sift.detectAndCompute(img_gray, None)

        # Create initial keypoint visualization
        img_keypoints = cv2.drawKeypoints(img_rgb.copy(), keypoints_sift, None)

        if descriptors is None or len(descriptors) < 2:
            raise ValueError("Not enough features detected to perform copy-move detection.")

        # Convert keypoints to serializable format
        keypoints_info = [(kp.pt[0], kp.pt[1]) for kp in keypoints_sift]

        # Prepare chunks for parallel processing
        chunks = np.array_split(range(len(descriptors)), nprocs)
        args_list = [(chunk, descriptors, keypoints_info, max_dist) for chunk in chunks]

        # Process in parallel
        matched_pts = []
        with Pool(processes=nprocs) as pool:
            results = pool.map(process_chunk, args_list)
            matched_pts = [pts for pts in results if pts is not None]

        # Draw results
        output_img = img_rgb.copy()
        for points in matched_pts:
            for x1, y1, x2, y2 in points:
                cv2.circle(output_img, (x1, y1), 4, (0, 0, 255), -1)
                cv2.circle(output_img, (x2, y2), 4, (255, 0, 0), -1)
                cv2.line(output_img, (x1, y1), (x2, y2), (0, 255, 0), 1)

        # Convert images to base64
        _, heatmap_encoded = cv2.imencode('.png', img_keypoints)
        heatmap_base64 = base64.b64encode(heatmap_encoded).decode('utf-8')
        
        _, final_encoded = cv2.imencode('.png', output_img)
        final_base64 = base64.b64encode(final_encoded).decode('utf-8')

        return {
            'heatmap': heatmap_base64,
            'finalOutput': final_base64
        }
        
    except Exception as e:
        return {'error': str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No image path provided'}))
        sys.exit(1)

    image_path = sys.argv[1]
    result = detect_copy_move(image_path)
    print(json.dumps(result))