function CarFuelSelectStep() {
    Step.apply(this, arguments);

    this.currentFuelElement = null;
    this.fuelTypesContainerElement = this.element.querySelector('.fuel-types');
    this._addDefaultListeners();
}

CarFuelSelectStep.prototype = Object.create(Step.prototype);

CarFuelSelectStep.prototype.mapWizardValues = function(wizardValues) {
    const { CAR_BRAND_SELECT_STEP, CAR_MODEL_SELECT_STEP } = steps;

    return {
        brand: wizardValues[CAR_BRAND_SELECT_STEP].brand,
        model: wizardValues[CAR_MODEL_SELECT_STEP].model,
    }
}

CarFuelSelectStep.prototype.isJumpToNextStepAllowed = function() {
    return !!this.values.fuelType;
}

CarFuelSelectStep.prototype.synchronizeWithWizard = function(mappedValues) {
    const { model, brand } = mappedValues;
    const { emptyElement } = helper;

    let provider = [];

    if (model && brand) {
        const { fuelType } = this.values;
        provider = cars.fuelTypes[brand][model];

        if (fuelType && !provider.includes(fuelType)) {
            this.values = {
                ...this.values,
                fuelType: null,
            };
        }

        emptyElement(this.fuelTypesContainerElement);
    }

    this._renderFuelTypes(provider)
}

CarFuelSelectStep.prototype._renderFuelTypes = function(provider) {
    provider.forEach(fuelType => {
        const fuelElement = document.createElement('div');
        fuelElement.textContent = fuelType;
        fuelElement.classList.add('fuel-type');

        if (fuelType === this.values.fuelType) {
            this.currentFuelElement = fuelElement;
            this.currentFuelElement.classList.add('selected');
        }

        this.fuelTypesContainerElement.appendChild(fuelElement);
    });
}

CarFuelSelectStep.prototype._addDefaultListeners = function() {
    this.fuelTypesContainerElement.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('fuel-type')) {
            if (this.currentFuelElement !== target) {
                if (this.currentFuelElement) {
                    this.currentFuelElement.classList.remove('selected');
                }

                this.currentFuelElement = target;
                this.currentFuelElement.classList.add('selected');

                this.values = {
                    ...this.values,
                    fuelType: target.textContent,
                }
            }
        }
    });
}