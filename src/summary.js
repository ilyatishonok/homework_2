function Summary(element) {
    this.element = element;
}

Summary.prototype.show = function(values) {
    this.element.style.display = 'block';
    const brandElement = this.element.querySelector('#car-brand');
    const modelElement = this.element.querySelector('#car-model');
    const fuelTypeElement = this.element.querySelector('#car-fuel-type');
    const transmissionTypeElement = this.element.querySelector('#car-transmission-type');

    brandElement.textContent = `Brand: ${values[steps.CAR_BRAND_SELECT_STEP].brand}`;
    modelElement.textContent = `Model: ${values[steps.CAR_MODEL_SELECT_STEP].model}`;
    fuelTypeElement.textContent = `Fuel Type: ${values[steps.CAR_FUEL_TYPE_SELECT_STEP].fuelType}`;
    transmissionTypeElement.textContent = `Transmission Type ${values[steps.CAR_TRANSIMISSION_SELECT_STEP].transmissionType}`;
}