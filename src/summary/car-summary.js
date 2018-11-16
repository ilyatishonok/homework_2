function CarSummary() {
    Summary.apply(this, arguments);
}

CarSummary.prototype = Object.create(Summary.prototype);

CarSummary.prototype.show = function(values) {
    const {
        CAR_BRAND_SELECT_STEP,
        CAR_MODEL_SELECT_STEP,
        CAR_FUEL_TYPE_SELECT_STEP,
        CAR_TRANSIMISSION_SELECT_STEP,
    } = steps;

    this.element.style.display = 'block';
    const brandElement = this.element.querySelector('#car-brand');
    const modelElement = this.element.querySelector('#car-model');
    const fuelTypeElement = this.element.querySelector('#car-fuel-type');
    const transmissionTypeElement = this.element.querySelector('#car-transmission-type');

    brandElement.textContent = `Brand: ${values[CAR_BRAND_SELECT_STEP].brand}`;
    modelElement.textContent = `Model: ${values[CAR_MODEL_SELECT_STEP].model}`;
    fuelTypeElement.textContent = `Fuel Type: ${values[CAR_FUEL_TYPE_SELECT_STEP].fuelType}`;
    transmissionTypeElement.textContent = `Transmission Type ${values[CAR_TRANSIMISSION_SELECT_STEP].transmissionType}`;
}