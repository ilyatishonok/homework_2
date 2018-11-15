function CarBrandSelectStep() {
    Step.apply(this, arguments);

    this.brandsContainerElement = this.element.querySelector('.brands');
    this.brandsProvider = null;
    this.currentBrandElement = null;

    this._addDefaultListeners();
    this._loadCarBrands();
}

CarBrandSelectStep.prototype = Object.create(Step.prototype);

CarBrandSelectStep.prototype.isJumpToNextStepAllowed = function() {
    return !!this.values.brand;
}

CarBrandSelectStep.prototype.setBrand = function(brand) {
    this.values = {
        ...this.values,
        brand,
    };

    return this;
}

CarBrandSelectStep.prototype.getBrand = function() {
    return this.values.brand;
}

CarBrandSelectStep.prototype._loadCarBrands = function() {
    this.brandsProvider = cars.brands;

    this.brandsProvider.forEach(brand => {
        const brandElement = document.createElement('div');
        brandElement.textContent = brand;
        brandElement.classList.add('brand');

        this.brandsContainerElement.appendChild(brandElement);
    });
}

CarBrandSelectStep.prototype._addDefaultListeners = function() {
    this.brandsContainerElement.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('brand')) {
            if (target !== this.currentBrandElement) {
                if (this.currentBrandElement) {
                    this.currentBrandElement.classList.remove('selected');
                }

                this.currentBrandElement = target;
                this.currentBrandElement.classList.add('selected');

                this.values = {
                    ...this.values,
                    brand: target.textContent,
                };
            }
        }
    })
}