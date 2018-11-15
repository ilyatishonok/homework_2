function Wizard(element, processStep, processSummary) {
    this.element = element;
    this.processStep = processStep;
    this.processSummary = processSummary;
    this.steps = {};
    this.isNextButtonAvailable = true;
    this.isPreviousButtonVisible = false;
    this.values = {};
    this.stepMappings = Object.create(null);

    this._reconstructDOM();
}

Wizard.prototype.update = function(stepId) {
    if (stepId) {
        const step = this.steps.find((step) => step.stepId === stepId);

        this.values = {
            ...this.values,
            [stepId]: step.getValues(),
        };
        
        this.setNextButtonAvailability(step.isJumpToNextStepAllowed());
    }
}

Wizard.prototype.setNextButtonAvailability = function(isAvailable) {
    if (this.isNextButtonAvailable !== isAvailable) {
        this.isNextButtonAvailable = isAvailable;

        this.nextActionElement.disabled = !isAvailable;
    }
}

Wizard.prototype.jumpToNextStep = function() {
    //this.steps[this.currentStepStep].leaveFromStep();

    this.currentStep.hide();

    const currentStepIndex = this.steps.indexOf(this.currentStep);

    if ((currentStepIndex + 1) === this.steps.length) {
        return this.showSummary();
    }

    this.stepTitlesElement.firstChild.childNodes[currentStepIndex].classList.remove('current');
    this.stepTitlesElement.firstChild.childNodes[currentStepIndex + 1].classList.add('current');

    const newStep = this.steps[currentStepIndex + 1];

    const newMappings = newStep.mapWizardValues(this.values);
    const isEqual = this._swallowCompare(newStep, newMappings);

    if (isEqual) {
        newStep.synchronizeWithWizard(newMappings);
    }

    this.previousActionElement.style.display = 'block';
    this.setNextButtonAvailability(newStep.isJumpToNextStepAllowed());
    
    this.currentStep = newStep;

    newStep.show();

    //this.steps[this.currentStep].afterStepDisplay();
}

Wizard.prototype.showSummary = function() {
    this.stepTitlesElement.style.display = 'none';
    this.actionsElement.style.display = 'none';
    this.summary.show(this.values);
}

Wizard.prototype.jumpToPreviousStep = function() {
    const currentStepIndex = this.steps.indexOf(this.currentStep);

    if (currentStepIndex === 0) {
        return false;
    }

    this.currentStep.hide();

    this.stepTitlesElement.firstChild.childNodes[currentStepIndex].classList.remove('current');
    this.stepTitlesElement.firstChild.childNodes[currentStepIndex - 1].classList.add('current');

    this.currentStep = this.steps[currentStepIndex - 1];
    const newStep = this.steps[currentStepIndex - 1];
    
    this.setNextButtonAvailability(newStep.isJumpToNextStepAllowed());

    if (currentStepIndex - 1 === 0) {
        this.previousActionElement.style.display = 'none';
    }

    newStep.show();
}

Wizard.prototype._findSummaryElement = function() {
    return this.element.querySelector('[wizard-summary="true"');
}

Wizard.prototype._findStepsElements = function() {
    return this.element.querySelectorAll('[wizard-step="true"]');
}

Wizard.prototype._reconstructDOM = function() {
    const stepElements = this._findStepsElements();
    const summaryElement = this._findSummaryElement();

    while (this.element.firstChild) {
        this.element.firstChild.remove();
    }

    const content = document.createElement('div');
    content.classList.add('content');

    this._createStepTitlesDOM(stepElements);
    this._createSteps(stepElements);
    this._setSummary(summaryElement);
    this._createActionsDOM();

    this.setNextButtonAvailability(this.currentStep.isJumpToNextStepAllowed());

    this.steps.forEach(step => {
        content.append(step.element);
    });

    content.appendChild(this.summary.element);

    this.element.appendChild(this.stepTitlesElement);
    this.element.appendChild(content);
    this.element.appendChild(this.actionsElement);
}

Wizard.prototype._swallowCompare = function(object1, object2) {
    return true;
}

Wizard.prototype._createStepTitlesDOM = function(stepElements) {
    this.stepTitlesElement = document.createElement('div');
    const tabListElement = document.createElement('ul');
    this.stepTitlesElement.classList.add('steps');
    tabListElement.classList.add('tablist');

    const stepTitles = this._getStepTitles(stepElements);

    stepTitles.forEach(stepTitle => {
        const stepTitleElement = document.createElement('li');
        stepTitleElement.textContent = stepTitle;
        stepTitleElement.classList.add('step-title');
        tabListElement.appendChild(stepTitleElement);
    });

    tabListElement.firstChild.classList.add('current');

    this.stepTitlesElement.appendChild(tabListElement);
}

Wizard.prototype._createActionsDOM = function() {
    const actionsElement = document.createElement('div');
    const nextActionElement = document.createElement('button');
    const previousActionElement = document.createElement('button');

    nextActionElement.textContent = 'Next';
    nextActionElement.classList.add('next-action');
    previousActionElement.textContent = 'Previous';
    previousActionElement.classList.add('previous-action');
    previousActionElement.style.display = 'none';

    this.nextActionElement = nextActionElement
    this.previousActionElement = previousActionElement;

    this.nextActionElement.addEventListener('click', event => {
        //validate

        this.jumpToNextStep();
    })

    this.previousActionElement.addEventListener('click', event => {
        this.jumpToPreviousStep();
    });

    this.actionsElement = actionsElement;

    this.actionsElement.classList.add('actions');
    this.actionsElement.appendChild(previousActionElement);
    this.actionsElement.appendChild(nextActionElement);
}

Wizard.prototype._createSteps = function(stepElements) {
    this.steps = [];

    const update = this.update.bind(this);

    stepElements.forEach(stepElement => {
        const wizardId = stepElement.getAttribute('wizard-id');
        let step = this.processStep(stepElement, wizardId, update);

        if (!(step instanceof Step)) {
            step = new Step(stepElement, wizardId, update);
        }

        step.element.style.display = 'none';

        this.steps.push(step);
    });
    
    const [ firstStep ] = this.steps;
    firstStep.show();
    this.currentStep = firstStep;
}

Wizard.prototype._getStepTitles = function(stepElements) {
    const stepTitles = [];

    stepElements.forEach(stepElement => {
        stepTitles.push(stepElement.getAttribute('wizard-title'));
    });

    return stepTitles;
}

Wizard.prototype._setSummary = function(summaryElement) {
    let summary = this.processSummary(summaryElement);

    if (!(summary instanceof Summary)) {
        summary = new Summary(summaryElement);
    }

    this.summary = summary;
}