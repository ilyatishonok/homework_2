function Step(element, stepId, title, update) {
    let values = Object.create(null);
    this.element = element;
    this.stepId = stepId;
    this.title = title;

    this.element.style.display = 'none';

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

Step.prototype.mapWizardValues = function() {
    return {};
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