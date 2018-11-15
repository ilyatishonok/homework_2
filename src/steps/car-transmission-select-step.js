function CarTransmissionSelectStep() {
    Step.apply(this, arguments);

    this.currentTransmissionElement = null;
    this.transmissionTypesContainerElement = this.element.querySelector('.transmission-types');
    this._addDefaultListeners();
}

CarTransmissionSelectStep.prototype = Object.create(Step.prototype);

CarTransmissionSelectStep.prototype.mapWizardValues = function(wizardValues) {
    const { CAR_BRAND_SELECT_STEP, CAR_MODEL_SELECT_STEP } = steps;

    return {
        brand: wizardValues[CAR_BRAND_SELECT_STEP].brand,
        model: wizardValues[CAR_MODEL_SELECT_STEP].model,
    }
}

CarTransmissionSelectStep.prototype.isJumpToNextStepAllowed = function() {
    return !!this.values.transmissionType;
}

CarTransmissionSelectStep.prototype.synchronizeWithWizard = function(mappedValues) {
    const { model, brand } = mappedValues;

    let provider = [];

    if (model && brand) {
        provider = cars.transmissionTypes[brand][model];

        if (!provider.includes(this.values.transmissionType)) {
            this.values = {
                ...this.values,
                transmissionType: null,
            };
        }

        while (this.transmissionTypesContainerElement.firstChild) {
            this.transmissionTypesContainerElement.removeChild(this.transmissionTypesContainerElement.firstChild);
        }
    }

    this._renderTransmissionTypes(provider)
}

CarTransmissionSelectStep.prototype._renderTransmissionTypes = function(provider) {
    provider.forEach(transmissionType => {
        const transmissionElement = document.createElement('div');
        transmissionElement.textContent = transmissionType;
        transmissionElement.classList.add('transmission-type');

        if (transmissionType === this.values.transmissionType) {
            this.currentTransmissionElement = transmissionElement;
            this.currentTransmissionElement.classList.add('selected');
        }

        this.transmissionTypesContainerElement.appendChild(transmissionElement);
    });
}

CarTransmissionSelectStep.prototype._addDefaultListeners = function() {
    this.transmissionTypesContainerElement.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('transmission-type')) {
            if (this.currentTransmissionElement !== target) {
                if (this.currentTransmissionElement) {
                    this.currentTransmissionElement.classList.remove('selected');
                }

                this.currentTransmissionElement = target;
                this.currentTransmissionElement.classList.add('selected');

                this.values = {
                    ...this.values,
                    transmissionType: target.textContent,
                }
            }
        }
    });
}