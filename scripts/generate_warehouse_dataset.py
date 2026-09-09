import os
import random
import yaml
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

# Root directories
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASET_DIR = os.path.join(BASE_DIR, "datasets", "warehouse")
IMAGES_TRAIN = os.path.join(DATASET_DIR, "images", "train")
IMAGES_VAL = os.path.join(DATASET_DIR, "images", "val")
LABELS_TRAIN = os.path.join(DATASET_DIR, "labels", "train")
LABELS_VAL = os.path.join(DATASET_DIR, "labels", "val")

os.makedirs(IMAGES_TRAIN, exist_ok=True)
os.makedirs(IMAGES_VAL, exist_ok=True)
os.makedirs(LABELS_TRAIN, exist_ok=True)
os.makedirs(LABELS_VAL, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)

# Classes
# 0: box
# 1: damaged_package
# 2: worker
# 3: empty_bin
# 4: forklift
CLASSES = ["box", "damaged_package", "worker", "empty_bin", "forklift"]

# Save data.yaml
data_yaml_path = os.path.join(DATASET_DIR, "data.yaml")
data_yaml_content = {
    "path": DATASET_DIR.replace("\\", "/"),
    "train": "images/train",
    "val": "images/val",
    "names": {i: name for i, name in enumerate(CLASSES)}
}
with open(data_yaml_path, "w") as f:
    yaml.dump(data_yaml_content, f, sort_keys=False)

print(f"Created data.yaml at {data_yaml_path}")

WIDTH, HEIGHT = 640, 640

def draw_warehouse_background():
    # Create realistic warehouse background: concrete floor, industrial steel walls, rack vertical beams
    img = Image.new("RGB", (WIDTH, HEIGHT), color=(45, 52, 58))
    draw = ImageDraw.Draw(img)

    # Floor (lower half)
    floor_y = int(HEIGHT * 0.45)
    draw.rectangle([0, floor_y, WIDTH, HEIGHT], fill=(70, 75, 80))

    # Floor yellow safety grid lines
    for x in range(0, WIDTH, 120):
        draw.line([x, floor_y, x - 60, HEIGHT], fill=(190, 160, 30), width=3)
    draw.line([0, floor_y + 10, WIDTH, floor_y + 10], fill=(210, 180, 40), width=4)

    # Racks & Uprights in background
    for rx in [40, 200, 360, 520]:
        # Blue/Orange steel columns
        draw.rectangle([rx, 40, rx + 14, floor_y + 40], fill=(30, 80, 160))
        draw.rectangle([rx + 14, 40, rx + 18, floor_y + 40], fill=(20, 50, 110))
        # Horizontal orange shelf beams
        for sy in [120, 210, 300]:
            draw.rectangle([rx - 20, sy, rx + 140, sy + 10], fill=(220, 95, 20))

    return img

def create_synthetic_scene(idx, is_val=False):
    img = draw_warehouse_background()
    draw = ImageDraw.Draw(img)
    labels = []

    # Decide what elements to place
    scene_type = random.choice(["damaged_inspection", "storage_pallets", "worker_forklift", "empty_racks", "mixed"])

    # 1. Boxes / Pallets
    if scene_type in ["damaged_inspection", "storage_pallets", "mixed"]:
        num_boxes = random.randint(1, 3)
        for b in range(num_boxes):
            bx = random.randint(80 + b * 160, min(WIDTH - 150, 140 + b * 170))
            by = random.randint(320, 450)
            bw = random.randint(100, 150)
            bh = random.randint(90, 140)

            # Corrugated Cardboard Brown
            cardboard_color = (random.randint(180, 205), random.randint(130, 155), random.randint(80, 105))
            draw.rectangle([bx, by, bx + bw, by + bh], fill=cardboard_color, outline=(110, 80, 50), width=3)

            # Tape & Shipping label
            draw.line([bx + bw // 2, by, bx + bw // 2, by + bh], fill=(150, 110, 60), width=6)
            draw.rectangle([bx + 15, by + 15, bx + 55, by + 45], fill=(240, 240, 240), outline=(50, 50, 50), width=1)
            # Barcode lines on label
            for lx in range(bx + 20, bx + 50, 4):
                draw.line([lx, by + 25, lx, by + 40], fill=(20, 20, 20), width=2)

            # Check if this box is DAMAGED (Class 1) or NORMAL BOX (Class 0)
            if scene_type == "damaged_inspection" and b == 0:
                # Add crushed/punctured/torn texture
                # Draw jagged tear / crushed corner
                cx, cy = bx + bw - 30, by + 15
                draw.polygon([(cx, cy), (cx + 35, cy - 10), (cx + 40, cy + 35), (cx + 10, cy + 30)], fill=(60, 40, 25))
                # Crease lines
                draw.line([bx + 10, by + 30, bx + bw // 2, by + bh // 2], fill=(80, 50, 30), width=3)
                draw.line([bx + 30, by + bh - 15, bx + bw - 20, by + 40], fill=(70, 45, 25), width=2)
                
                # YOLO label: damaged_package (class 1)
                x_c = (bx + bw / 2) / WIDTH
                y_c = (by + bh / 2) / HEIGHT
                w_norm = bw / WIDTH
                h_norm = bh / HEIGHT
                labels.append((1, x_c, y_c, w_norm, h_norm))
            else:
                # YOLO label: box (class 0)
                x_c = (bx + bw / 2) / WIDTH
                y_c = (by + bh / 2) / HEIGHT
                w_norm = bw / WIDTH
                h_norm = bh / HEIGHT
                labels.append((0, x_c, y_c, w_norm, h_norm))

    # 2. Worker (Class 2)
    if scene_type in ["worker_forklift", "damaged_inspection", "mixed"] and random.random() > 0.3:
        wx = random.randint(40, 180) if random.random() > 0.5 else random.randint(460, 560)
        wy = random.randint(260, 340)
        ww = random.randint(50, 75)
        wh = random.randint(150, 210)

        # Worker body: Hi-vis vest (neon orange/yellow), dark pants, hard hat
        # Hard hat
        draw.ellipse([wx + ww // 4, wy, wx + 3 * ww // 4, wy + wh // 5], fill=(255, 215, 0))
        # Head
        draw.ellipse([wx + ww // 3, wy + wh // 8, wx + 2 * ww // 3, wy + wh // 4], fill=(235, 195, 160))
        # Hi-vis vest
        draw.rectangle([wx + ww // 6, wy + wh // 4, wx + 5 * ww // 6, wy + 2 * wh // 3], fill=(255, 102, 0), outline=(220, 220, 220), width=2)
        # Reflective silver stripes
        draw.line([wx + ww // 6, wy + wh // 2, wx + 5 * ww // 6, wy + wh // 2], fill=(230, 230, 240), width=4)
        # Dark cargo pants
        draw.rectangle([wx + ww // 4, wy + 2 * wh // 3, wx + 3 * ww // 4, wy + wh], fill=(30, 40, 55))

        x_c = (wx + ww / 2) / WIDTH
        y_c = (wy + wh / 2) / HEIGHT
        w_norm = ww / WIDTH
        h_norm = wh / HEIGHT
        labels.append((2, x_c, y_c, w_norm, h_norm))

    # 3. Empty Bin / Empty Rack Bay (Class 3)
    if scene_type in ["empty_racks", "storage_pallets", "mixed"]:
        ebx = random.randint(220, 420)
        eby = random.randint(125, 205)
        ebw = random.randint(90, 140)
        ebh = random.randint(75, 95)
        # Empty shelf bracket showing dark background
        draw.rectangle([ebx, eby, ebx + ebw, eby + ebh], outline=(80, 150, 220), width=2)
        # Empty space cross hatch
        draw.line([ebx, eby, ebx + ebw, eby + ebh], fill=(60, 70, 80), width=1)
        draw.line([ebx + ebw, eby, ebx, eby + ebh], fill=(60, 70, 80), width=1)

        x_c = (ebx + ebw / 2) / WIDTH
        y_c = (eby + ebh / 2) / HEIGHT
        w_norm = ebw / WIDTH
        h_norm = ebh / HEIGHT
        labels.append((3, x_c, y_c, w_norm, h_norm))

    # 4. Forklift (Class 4)
    if scene_type in ["worker_forklift", "mixed"] and random.random() > 0.4:
        fx = random.randint(280, 440)
        fy = random.randint(310, 360)
        fw = random.randint(130, 170)
        fh = random.randint(130, 170)

        # Yellow Forklift Chassis
        draw.rectangle([fx + 25, fy + 40, fx + fw, fy + fh - 20], fill=(245, 185, 20), outline=(30, 30, 30), width=2)
        # Overhead protective cage
        draw.rectangle([fx + 50, fy, fx + fw - 15, fy + 40], outline=(40, 40, 40), width=4)
        # Front lift mast & forks
        draw.line([fx + 10, fy - 10, fx + 10, fy + fh - 10], fill=(50, 50, 50), width=6)
        draw.line([fx, fy + fh - 15, fx + 30, fy + fh - 15], fill=(70, 70, 70), width=5)
        # Black wheels
        draw.ellipse([fx + 30, fy + fh - 30, fx + 65, fy + fh], fill=(20, 20, 20))
        draw.ellipse([fx + fw - 45, fy + fh - 30, fx + fw - 10, fy + fh], fill=(20, 20, 20))

        x_c = (fx + fw / 2) / WIDTH
        y_c = (fy + fh / 2) / HEIGHT
        w_norm = fw / WIDTH
        h_norm = fh / HEIGHT
        labels.append((4, x_c, y_c, w_norm, h_norm))

    # Image noise / realistic camera texture
    img = img.filter(ImageFilter.GaussianBlur(radius=0.4))

    # Save image and label
    prefix = "val" if is_val else "train"
    img_dir = IMAGES_VAL if is_val else IMAGES_TRAIN
    lbl_dir = LABELS_VAL if is_val else LABELS_TRAIN

    filename = f"warehouse_{prefix}_{idx:04d}"
    img_path = os.path.join(img_dir, f"{filename}.jpg")
    lbl_path = os.path.join(lbl_dir, f"{filename}.txt")

    img.save(img_path, quality=92)
    with open(lbl_path, "w") as f:
        for lbl in labels:
            f.write(f"{lbl[0]} {lbl[1]:.5f} {lbl[2]:.5f} {lbl[3]:.5f} {lbl[4]:.5f}\n")

# Generate 60 train images, 20 val images
print("Generating train images...")
for i in range(60):
    create_synthetic_scene(i, is_val=False)

print("Generating validation images...")
for i in range(20):
    create_synthetic_scene(i, is_val=True)

print("Warehouse dataset generation complete!")
