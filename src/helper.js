const helper = (function() {
    const swallowCompare = (object, other) => {
        const objectKeys = Object.keys(object);
        const otherKeys = Object.keys(other);

        if (objectKeys.length !== otherKeys.length) {
            return false;
        }

        let isEqual = true;

        objectKeys.every(key => {
            if (object[key] !== other[key]) {
                isEqual = false;

                return false;
            }

            return true;
        });

        return isEqual;
    }

    const findSummaryElement = element => {
        return element.querySelector('[wizard-summary="true"');
    }

    const findStepsElements = element => {
        return element.querySelectorAll('[wizard-step="true"');
    }

    const emptyElement = element => {
        while (element.firstChild) {
            element.firstChild.remove();
        }
    }

    const switchActiveStepTitle = (stepTitle, newStepTitle) => {
        stepTitle.classList.remove('current');
        newStepTitle.classList.add('current');
    }

    const getStepTitles = (stepElements, attribute) => {
        const stepTitles = [];

        stepElements.forEach(stepElement => {
            stepTitles.push(stepElement.getAttribute(attribute));
        });

        return stepTitles;
    }

    return {
        swallowCompare,
        findStepsElements,
        findSummaryElement,
        emptyElement,
        switchActiveStepTitle,
        getStepTitles,
    };
})();