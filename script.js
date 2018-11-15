const wizard = new Wizard(document.querySelector('.wizard'), (stepElement, stepId, update) => {
    const {
        CAR_MODEL_SELECT_STEP,
        CAR_BRAND_SELECT_STEP,
        CAR_FUEL_TYPE_SELECT_STEP,
        CAR_TRANSIMISSION_SELECT_STEP, 
    } = steps;
    switch (stepId) {
        case CAR_MODEL_SELECT_STEP:
            return new CarModelSelectStep(stepElement, stepId, update);
        case CAR_BRAND_SELECT_STEP:
            return new CarBrandSelectStep(stepElement, stepId, update);
        case CAR_FUEL_TYPE_SELECT_STEP:
            return new CarFuelSelectStep(stepElement, stepId, update);
        case CAR_TRANSIMISSION_SELECT_STEP: 
            return new CarTransmissionSelectStep(stepElement, stepId, update);
        default:
            return new Step(stepElement, stepId, update);
    }
}, element => {
    return new Summary(element);
});