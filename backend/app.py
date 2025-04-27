import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from sklearn.cluster import DBSCAN
import matplotlib.pyplot as plt
from skimage.feature import match_template

# def rgb_histogram_analysis(img_path):
#     img = cv2.imread(img_path)
#     colors = ('b', 'g', 'r')
#     plt.figure()
#     for i, color in enumerate(colors):
#         hist = cv2.calcHist([img], [i], None, [256], [0, 256])
#         plt.plot(hist, color=color)
#     plt.title("RGB Histogram (Mismatched peaks = splicing)")
#     plt.show()

def error_level_analysis(img_path, quality=90, threshold=25, min_radius=10):
    # Step 1: Perform ELA
    img = cv2.imread(img_path)
    cv2.imwrite("temp.jpg", img, [cv2.IMWRITE_JPEG_QUALITY, quality])
    temp = cv2.imread("temp.jpg")
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
            print(f"Detected tampered region at ({int(x)}, {int(y)}) with radius {int(radius)}")
        else:
            print("No significant tampering detected (largest region too small)")
    else:
        print("No tampered regions found")
    
    # Step 4: Display results
    plt.figure(figsize=(12, 6))
    plt.subplot(131), plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)), plt.title("Original")
    plt.subplot(132), plt.imshow(ela, cmap='gray'), plt.title("ELA Heatmap")
    plt.subplot(133), plt.imshow(cv2.cvtColor(output, cv2.COLOR_BGR2RGB)), plt.title("Largest Tampered Region")
    plt.tight_layout()
    plt.show()

# def chroma_subsampling_analysis(img_path):
#     img = cv2.imread(img_path)
#     ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
#     cr = ycrcb[:,:,1]
#     cb = ycrcb[:,:,2]
#     plt.subplot(121), plt.imshow(cr, cmap='gray'), plt.title("Cr Channel")
#     plt.subplot(122), plt.imshow(cb, cmap='gray'), plt.title("Cb Channel")
#     plt.show()

if __name__ == "__main__":
    # print("Select a forgery detection technique:")
    # print("1. RGB Histogram Analysis (Splicing)")
    # print("2. Error Level Analysis (ELA)")
    # print("3. Chroma Subsampling (JPEG Splicing)")
    
    # choice = int(input("Enter choice (1-5): "))
    # img_path = input("Enter image path: ").strip('"')  # Remove quotes if dragged into terminal
    img_path = './Tp_D_NRN_S_N_nat10145_ani00024_11981.jpg'

    # if choice == 1:
    #     rgb_histogram_analysis(img_path)
    # elif choice == 2:
    error_level_analysis(img_path)
    # elif choice == 3:
    #     chroma_subsampling_analysis(img_path)
    # else:
    #     print("Invalid choice!")