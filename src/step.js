function Step(element, stepId, update) {
    let values = Object.create(null);
    this.element = element;
    this.stepId = stepId;

    Object.defineProperty(this, 'values', {
        get() {
            return { ...values };
        },
        set(newValues) {
            values = newValues;

            update(stepId);
        }
    });
}

Step.prototype.getValues = function() {
    return this.values;
}

Step.prototype.isJumpToNextStepAllowed = function() {
    return true;
}

Step.prototype.mapWizardValues = function(wizardValues) {
    return true;
}

Step.prototype.validate = function() {
    return true;
}

Step.prototype.hide = function() {
    this.element.style.display = 'none';
}

Step.prototype.show = function() {
    this.element.style.display = 'block';
}