const processStep = (stepElement, stepId, title, update) => {
    const {
        CAR_MODEL_SELECT_STEP,
        CAR_BRAND_SELECT_STEP,
        CAR_FUEL_TYPE_SELECT_STEP,
        CAR_TRANSIMISSION_SELECT_STEP, 
    } = steps;
    switch (stepId) {
        case CAR_MODEL_SELECT_STEP:
            return new CarModelSelectStep(stepElement, stepId, title, update);
        case CAR_BRAND_SELECT_STEP:
            return new CarBrandSelectStep(stepElement, stepId, title, update);
        case CAR_FUEL_TYPE_SELECT_STEP:
            return new CarFuelSelectStep(stepElement, stepId, title, update);
        case CAR_TRANSIMISSION_SELECT_STEP: 
            return new CarTransmissionSelectStep(stepElement, stepId, title, update);
        default:
            return new Step(stepElement, stepId, title, update);
    }
}

const processSumary = element => {
    return new CarSummary(element);
}

const wizard = new Wizard(document.querySelector('.wizard'), processStep, processSumary);