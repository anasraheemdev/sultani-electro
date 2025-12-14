interface DeliveryLocation {
    city: string;
    baseCost: number;
}

const DELIVERY_LOCATIONS: DeliveryLocation[] = [
    { city: "Karachi", baseCost: 200 },
    { city: "Lahore", baseCost: 250 },
    { city: "Islamabad", baseCost: 300 },
    { city: "Rawalpindi", baseCost: 300 },
    { city: "Faisalabad", baseCost: 350 },
    { city: "Multan", baseCost: 400 },
    { city: "Peshawar", baseCost: 450 },
    { city: "Quetta", baseCost: 600 },
    { city: "Sialkot", baseCost: 350 },
    { city: "Gujranwala", baseCost: 300 },
];

const FREE_DELIVERY_THRESHOLD = 50000; // PKR
const WEIGHT_COST_PER_KG = 50; // PKR per kg after 10kg

interface DeliveryCostParams {
    city: string;
    orderTotal: number;
    totalWeight?: number; // in kg
}

export function calculateDeliveryCost({
    city,
    orderTotal,
    totalWeight = 0,
}: DeliveryCostParams): {
    cost: number;
    isFree: boolean;
    breakdown: {
        baseCost: number;
        weightCost: number;
        discount: number;
    };
} {
    // Free delivery for orders above threshold
    if (orderTotal >= FREE_DELIVERY_THRESHOLD) {
        return {
            cost: 0,
            isFree: true,
            breakdown: {
                baseCost: 0,
                weightCost: 0,
                discount: 0,
            },
        };
    }

    // Find city base cost
    const location = DELIVERY_LOCATIONS.find(
        (loc) => loc.city.toLowerCase() === city.toLowerCase()
    );
    const baseCost = location?.baseCost || 500; // Default cost for unlisted cities

    // Calculate weight-based cost (for items over 10kg)
    let weightCost = 0;
    if (totalWeight > 10) {
        const extraWeight = totalWeight - 10;
        weightCost = Math.ceil(extraWeight) * WEIGHT_COST_PER_KG;
    }

    const totalCost = baseCost + weightCost;

    return {
        cost: totalCost,
        isFree: false,
        breakdown: {
            baseCost,
            weightCost,
            discount: 0,
        },
    };
}

export function getAvailableCities(): string[] {
    return DELIVERY_LOCATIONS.map((loc) => loc.city);
}

export function getFreeDeliveryThreshold(): number {
    return FREE_DELIVERY_THRESHOLD;
}

export function getDeliveryEstimate(city: string): string {
    const majorCities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi"];

    if (majorCities.includes(city)) {
        return "2-3 business days";
    }

    return "3-5 business days";
}
