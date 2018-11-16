function CarModelSelectStep() {
    Step.apply(this, arguments);
    
    this.currentModelElement = null;
    this.modelsContainerElement = this.element.querySelector('.models');
    this._addDefaultListeners();
}

CarModelSelectStep.prototype = Object.create(Step.prototype);

CarModelSelectStep.prototype.setCarModel = function(model) {
    this.values = {
        ...this.values,
        model,
    };

    return this;
}

CarModelSelectStep.prototype.isJumpToNextStepAllowed = function() {
    return !!this.values.model;
}

CarModelSelectStep.prototype.mapWizardValues = function(wizardValues) {
    const { CAR_BRAND_SELECT_STEP } = steps;

    return {
        brand: wizardValues[CAR_BRAND_SELECT_STEP].brand,
    }
}

CarModelSelectStep.prototype._loadCarModels = function(provider) {
    provider.forEach(model => {
        const modelElement = document.createElement('div');
        modelElement.classList.add('model');
        modelElement.textContent = model;

        if (model === this.getCarModel()) {
            this.currentModelElement = modelElement;
            this.currentModelElement.classList.add('selected');
        }

        this.modelsContainerElement.appendChild(modelElement);
    });
}

CarModelSelectStep.prototype._addDefaultListeners =  function() {
    this.modelsContainerElement.addEventListener('click', event => {
        const { target } = event;
        
        if (target.classList.contains('model')) {
            if (this.currentModelElement !== target) {
                if (this.currentModelElement) {
                    this.currentModelElement.classList.remove('selected');
                }

                this.currentModelElement = target;
                this.currentModelElement.classList.add('selected');
    
                this.setCarModel(target.textContent);
            }
        }
    }); 
}

CarModelSelectStep.prototype.synchronizeWithWizard = function(mappedValues) {
    const { brand } = mappedValues;
    const { emptyElement } = helper;
    
    let provider = [];

    if (brand) {
        const model = this.getCarModel();
        provider = cars.models[brand];

        if (model && !provider.includes(model)) {

            this.setCarModel(null);
        }

        emptyElement(this.modelsContainerElement);
    }

    this._loadCarModels(provider);
}

CarModelSelectStep.prototype.getCarModel = function() {
    return this.values.model;
}
