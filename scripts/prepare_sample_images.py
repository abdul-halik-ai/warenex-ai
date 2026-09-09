import os
import shutil
from PIL import Image

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SAMPLES_DIR = os.path.join(BASE_DIR, "public", "samples")
VAL_DIR = os.path.join(BASE_DIR, "datasets", "warehouse", "images", "val")
VAL_LBL_DIR = os.path.join(BASE_DIR, "datasets", "warehouse", "labels", "val")

os.makedirs(SAMPLES_DIR, exist_ok=True)

# Find samples matching each class
# Class 0: box, 1: damaged_package, 2: worker, 3: empty_bin, 4: forklift
samples = {
    "sample_damaged.jpg": None,
    "sample_intact.jpg": None,
    "sample_worker.jpg": None,
    "sample_empty.jpg": None
}

for fname in os.listdir(VAL_LBL_DIR):
    if not fname.endswith(".txt"):
        continue
    lbl_path = os.path.join(VAL_LBL_DIR, fname)
    img_name = fname.replace(".txt", ".jpg")
    img_path = os.path.join(VAL_DIR, img_name)

    if not os.path.exists(img_path):
        continue

    with open(lbl_path) as f:
        classes_in_file = [int(line.split()[0]) for line in f if line.strip()]

    if 1 in classes_in_file and not samples["sample_damaged.jpg"]:
        samples["sample_damaged.jpg"] = img_path
    elif 0 in classes_in_file and 1 not in classes_in_file and not samples["sample_intact.jpg"]:
        samples["sample_intact.jpg"] = img_path
    elif 2 in classes_in_file and not samples["sample_worker.jpg"]:
        samples["sample_worker.jpg"] = img_path
    elif 3 in classes_in_file and not samples["sample_empty.jpg"]:
        samples["sample_empty.jpg"] = img_path

# Copy found samples
for target_name, source_path in samples.items():
    dest = os.path.join(SAMPLES_DIR, target_name)
    if source_path and os.path.exists(source_path):
        shutil.copyfile(source_path, dest)
        print(f"Copied {source_path} -> {dest}")
    else:
        # Fallback copy first image
        first_img = os.path.join(VAL_DIR, os.listdir(VAL_DIR)[0])
        shutil.copyfile(first_img, dest)
        print(f"Fallback copied {first_img} -> {dest}")

print("Sample images ready in public/samples/")
