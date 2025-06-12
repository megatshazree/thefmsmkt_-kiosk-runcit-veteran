"""
Shelf monitoring simulation system with computer vision detection capabilities.
Simulates real-world scenarios including detection errors, quality assessment, and foreign object detection.
"""

import random
import time
import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Enums for better type safety ---
class QualityLevel(Enum):
    FRESH = "fresh"
    GOOD = "good"
    FAIR = "fair"
    POOR_CONSIDER_REMOVAL = "poor_consider_removal"
    OUT_OF_STOCK = "out_of_stock"

class DefectType(Enum):
    SLIGHT_WILTING = "slight_wilting"
    MINOR_BRUISE_DEVELOPED = "minor_bruise_developed"
    PACKAGING_COMPROMISED_SHELF = "packaging_compromised_shelf"
    LABEL_FADED = "label_faded"
    NEARING_EXPIRY_VISUAL_SIGNS = "nearing_expiry_visual_signs"
    ITEM_DISPLACED = "item_displaced"

class ForeignObjectType(Enum):
    PLASTIC_FRAGMENT = "plastic_fragment"
    METAL_SHAVING_SIM = "metal_shaving_sim"
    UNKNOWN_DEBRIS = "unknown_debris"
    INSECT_SIM = "insect_sim"

# --- Configuration ---
@dataclass
class SimulationConfig:
    """Configuration parameters for the simulation."""
    image_width: int = 1280
    image_height: int = 720
    obscured_probability: float = 0.10
    misidentification_probability: float = 0.03
    significant_miscount_probability: float = 0.05
    minor_miscount_probability: float = 0.15
    foreign_object_probability: float = 0.02
    bounding_box_failure_probability: float = 0.01

# --- Data Classes ---
@dataclass
class BoundingBox:
    """Represents a bounding box for object detection."""
    x: int
    y: int
    width: int
    height: int
    
    def is_valid(self) -> bool:
        """Check if bounding box has valid dimensions."""
        return self.width > 0 and self.height > 0

@dataclass
class Product:
    """Represents a product with unique identifier and name."""
    product_id: str
    name: str
    
    def __post_init__(self):
        if not self.product_id or not self.name:
            raise ValueError("Product ID and name cannot be empty")

@dataclass
class QualityAssessment:
    """Represents quality assessment results."""
    quality_level: QualityLevel
    defects: List[DefectType] = field(default_factory=list)
    
    def has_defects(self) -> bool:
        """Check if the item has any defects."""
        return len(self.defects) > 0

@dataclass
class ForeignObject:
    """Represents a detected foreign object."""
    object_type: ForeignObjectType
    location: Tuple[int, int]
    confidence: float
    
    def __post_init__(self):
        if not 0 <= self.confidence <= 1:
            raise ValueError("Confidence must be between 0 and 1")

class ShelfItem:
    """Represents an item on a shelf with detection capabilities."""
    
    def __init__(self, product: Product, actual_quantity: int):
        self.product = product
        self.actual_quantity = max(0, actual_quantity)
        
        # Detection state
        self.last_detected_quantity: Optional[int] = None
        self.detection_confidence: float = 0.0
        self.is_obscured: bool = False
        self.misidentification_flag: bool = False
        self.last_detected_bounding_box: Optional[BoundingBox] = None
        self.last_quality_assessment: Optional[QualityAssessment] = None
        self.last_seen_timestamp: Optional[datetime.datetime] = None
    
    def update_detection(self, 
                        detected_quantity: int,
                        confidence: float,
                        bounding_box: Optional[BoundingBox] = None,
                        quality_assessment: Optional[QualityAssessment] = None,
                        is_obscured: bool = False,
                        is_misidentified: bool = False):
        """Update detection results for this item."""
        self.last_detected_quantity = max(0, detected_quantity)
        self.detection_confidence = max(0.0, min(1.0, confidence))
        self.last_detected_bounding_box = bounding_box
        self.last_quality_assessment = quality_assessment
        self.is_obscured = is_obscured
        self.misidentification_flag = is_misidentified
        self.last_seen_timestamp = datetime.datetime.now()
    
    def get_detection_accuracy(self) -> Optional[float]:
        """Calculate detection accuracy compared to actual quantity."""
        if self.last_detected_quantity is None:
            return None
        
        if self.actual_quantity == 0 and self.last_detected_quantity == 0:
            return 1.0
        
        if self.actual_quantity == 0:
            return 0.0
        
        return 1.0 - abs(self.actual_quantity - self.last_detected_quantity) / self.actual_quantity
    
    def __str__(self) -> str:
        """String representation of the shelf item."""
        detected_qty_str = str(self.last_detected_quantity) if self.last_detected_quantity is not None else 'N/A'
        confidence_str = f"{self.detection_confidence:.2f}" if self.detection_confidence > 0 else "N/A"
        timestamp_str = self.last_seen_timestamp.strftime('%Y-%m-%d %H:%M:%S') if self.last_seen_timestamp else 'N/A'
        bbox_str = f"({self.last_detected_bounding_box.x}, {self.last_detected_bounding_box.y}, {self.last_detected_bounding_box.width}, {self.last_detected_bounding_box.height})" if self.last_detected_bounding_box else "N/A"
        
        quality_info = "N/A"
        defects_info = "None"
        if self.last_quality_assessment:
            quality_info = self.last_quality_assessment.quality_level.value
            defects_info = ", ".join([d.value for d in self.last_quality_assessment.defects]) if self.last_quality_assessment.defects else "None"
        
        accuracy = self.get_detection_accuracy()
        accuracy_str = f"{accuracy:.2%}" if accuracy is not None else "N/A"
        
        return (f"Product: {self.product.name} (ID: {self.product.product_id})\n"
                f"  Actual Quantity: {self.actual_quantity}\n"
                f"  Last Detected: {detected_qty_str} (Confidence: {confidence_str})\n"
                f"  Detection Accuracy: {accuracy_str}\n"
                f"  Bounding Box: {bbox_str}\n"
                f"  Quality: {quality_info}, Defects: {defects_info}\n"
                f"  Obscured: {'Yes' if self.is_obscured else 'No'}\n"
                f"  Misidentified: {'Yes' if self.misidentification_flag else 'No'}\n"
                f"  Last Seen: {timestamp_str}")

class Shelf:
    """Represents a shelf with items and detection capabilities."""
    
    def __init__(self, shelf_id: str):
        if not shelf_id:
            raise ValueError("Shelf ID cannot be empty")
        
        self.shelf_id = shelf_id
        self.items: Dict[str, ShelfItem] = {}
        self.foreign_objects_detected: List[ForeignObject] = []
    
    def add_item(self, item: ShelfItem) -> None:
        """Add an item to the shelf."""
        self.items[item.product.product_id] = item
        logger.info(f"Added item {item.product.name} to shelf {self.shelf_id}")
    
    def get_item(self, product_id: str) -> Optional[ShelfItem]:
        """Get an item by product ID."""
        return self.items.get(product_id)
    
    def update_item_quantity(self, product_id: str, new_quantity: int) -> bool:
        """Update the actual quantity of an item."""
        item = self.get_item(product_id)
        if item:
            old_quantity = item.actual_quantity
            item.actual_quantity = max(0, new_quantity)
            logger.info(f"Updated {item.product.name} quantity from {old_quantity} to {item.actual_quantity}")
            return True
        else:
            logger.warning(f"Product ID {product_id} not found on shelf {self.shelf_id}")
            return False
    
    def clear_foreign_objects(self) -> None:
        """Clear detected foreign objects."""
        self.foreign_objects_detected.clear()
    
    def get_total_items(self) -> int:
        """Get total number of items on shelf."""
        return sum(item.actual_quantity for item in self.items.values())

# --- Simulation Classes ---
class DetectionSimulator:
    """Handles detection simulation logic."""
    
    def __init__(self, config: SimulationConfig = None):
        self.config = config or SimulationConfig()
    
    def simulate_bounding_box(self) -> Optional[BoundingBox]:
        """Simulate bounding box detection."""
        if random.random() < self.config.bounding_box_failure_probability:
            return None
        
        width = random.randint(30, self.config.image_width // 4)
        height = random.randint(30, self.config.image_height // 4)
        x = random.randint(0, self.config.image_width - width)
        y = random.randint(0, self.config.image_height - height)
        
        return BoundingBox(x=x, y=y, width=width, height=height)
    
    def simulate_quality_assessment(self) -> QualityAssessment:
        """Simulate quality assessment."""
        quality = random.choice(list(QualityLevel))
        defects = []
        
        if quality == QualityLevel.FAIR and random.random() < 0.7:
            defects = random.sample(list(DefectType), 1)
        elif quality == QualityLevel.POOR_CONSIDER_REMOVAL:
            num_defects = random.randint(1, 2)
            defects = random.sample(list(DefectType), min(num_defects, len(DefectType)))
        
        return QualityAssessment(quality_level=quality, defects=defects)
    
    def simulate_foreign_object_detection(self) -> Optional[ForeignObject]:
        """Simulate foreign object detection."""
        if random.random() < self.config.foreign_object_probability:
            return ForeignObject(
                object_type=random.choice(list(ForeignObjectType)),
                location=(
                    random.randint(0, self.config.image_width),
                    random.randint(0, self.config.image_height)
                ),
                confidence=random.uniform(0.6, 0.95)
            )
        return None

class ShelfMonitoringSystem:
    """Main system for shelf monitoring simulation."""
    
    def __init__(self, config: SimulationConfig = None):
        self.config = config or SimulationConfig()
        self.detector = DetectionSimulator(self.config)
    
    def simulate_camera_scan(self, shelf: Shelf, configured_products: List[Product]) -> None:
        """Simulate a camera scan of the shelf."""
        logger.info(f"Starting camera scan for shelf {shelf.shelf_id}")
        shelf.clear_foreign_objects()
        
        for product in configured_products:
            self._process_product_detection(shelf, product)
        
        # Check for foreign objects
        for _ in range(3):  # Check multiple spots
            foreign_object = self.detector.simulate_foreign_object_detection()
            if foreign_object:
                shelf.foreign_objects_detected.append(foreign_object)
                logger.warning(f"Foreign object detected: {foreign_object.object_type.value}")
    
    def _process_product_detection(self, shelf: Shelf, product: Product) -> None:
        """Process detection for a specific product."""
        item = shelf.get_item(product.product_id)
        if not item:
            return
        
        current_time = datetime.datetime.now()
        
        # Handle out of stock
        if item.actual_quantity == 0:
            item.update_detection(
                detected_quantity=0,
                confidence=random.uniform(0.95, 1.0),
                quality_assessment=QualityAssessment(QualityLevel.OUT_OF_STOCK)
            )
            return
        
        # Check for obscured items
        if random.random() < self.config.obscured_probability:
            item.update_detection(
                detected_quantity=item.last_detected_quantity or 0,
                confidence=0.1,
                is_obscured=True
            )
            logger.info(f"Item {item.product.name} is obscured")
            return
        
        # Check for misidentification
        if random.random() < self.config.misidentification_probability:
            item.update_detection(
                detected_quantity=item.actual_quantity,
                confidence=random.uniform(0.4, 0.7),
                is_misidentified=True
            )
            logger.info(f"Item {item.product.name} was misidentified")
            return
        
        # Simulate quantity detection with various accuracy levels
        detected_quantity, confidence = self._simulate_quantity_detection(item.actual_quantity)
        bounding_box = self.detector.simulate_bounding_box()
        quality_assessment = self.detector.simulate_quality_assessment()
        
        item.update_detection(
            detected_quantity=detected_quantity,
            confidence=confidence,
            bounding_box=bounding_box,
            quality_assessment=quality_assessment
        )
        
        if not bounding_box:
            logger.warning(f"Failed to get bounding box for {item.product.name}")
        
        if quality_assessment.quality_level == QualityLevel.POOR_CONSIDER_REMOVAL:
            logger.warning(f"Poor quality detected for {item.product.name}")
    
    def _simulate_quantity_detection(self, actual_quantity: int) -> Tuple[int, float]:
        """Simulate quantity detection with realistic accuracy."""
        accuracy_roll = random.random()
        
        if accuracy_roll < self.config.significant_miscount_probability:
            # Significant miscount
            factor = random.uniform(0.5, 0.8) if random.random() < 0.5 else random.uniform(1.2, 1.5)
            detected = int(round(actual_quantity * factor))
            confidence = random.uniform(0.6, 0.80)
            logger.info(f"Significant miscount: actual={actual_quantity}, detected={detected}")
        elif accuracy_roll < self.config.significant_miscount_probability + self.config.minor_mis