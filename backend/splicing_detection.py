import cv2
import numpy as np
import base64
import json
import sys
import os

def error_level_analysis(img_path, quality=90, threshold=25, min_radius=10):
    try:
        # Read original image
        img = cv2.imread(img_path)
        if img is None:
            raise ValueError("Failed to read the image. Check the image path.")

        # Step 1: Perform ELA
        temp_path = "temp_ela.jpg"
        cv2.imwrite(temp_path, img, [cv2.IMWRITE_JPEG_QUALITY, quality])
        temp = cv2.imread(temp_path)
        ela = cv2.absdiff(img, temp)
        ela = (ela * 20).clip(0, 255).astype(np.uint8)  # Amplify differences
        
        # Step 2: Threshold to find tampered regions
        gray_ela = cv2.cvtColor(ela, cv2.COLOR_BGR2GRAY)
        _, binary_mask = cv2.threshold(gray_ela, threshold, 255, cv2.THRESH_BINARY)
        
        # Step 3: Find contours and keep only the largest one
        contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        output = img.copy()
        
        if contours:
            # Find the largest contour by area
            largest_contour = max(contours, key=cv2.contourArea)
            (x, y), radius = cv2.minEnclosingCircle(largest_contour)
            
            if radius > min_radius:  # Only draw if it meets the minimum size
                cv2.circle(output, (int(x), int(y)), int(radius), (0, 0, 255), 2)
                cv2.putText(output, "Tampered Region", (int(x)-100, int(y)-int(radius)-10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # Convert images to base64
        _, ela_encoded = cv2.imencode('.png', ela)
        ela_base64 = base64.b64encode(ela_encoded).decode('utf-8')
        
        _, output_encoded = cv2.imencode('.png', output)
        output_base64 = base64.b64encode(output_encoded).decode('utf-8')

        return {
            'heatmap': ela_base64,
            'finalOutput': output_base64
        }
        
    except Exception as e:
        return {'error': str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No image path provided'}))
        sys.exit(1)

    image_path = sys.argv[1]
    result = error_level_analysis(image_path)
    print(json.dumps(result))