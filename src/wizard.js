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

        console.log(this.values);
        
        this.setNextButtonAvailability(step.isJumpToNextStepAllowed());
    }
}

Wizard.prototype.setNextButtonAvailability = function(isAvailable) {
    if (this.isNextButtonAvailable !== isAvailable) {
        this.isNextButtonAvailable = isAvailable;

        this.nextActionElement.disabled = !isAvailable;
        
        isAvailable ? this.nextActionElement.classList.remove('disabled')
            : this.nextActionElement.classList.add('disabled');
    }
}

Wizard.prototype.jumpToNextStep = function() {
    this.currentStep.hide();

    const currentStepIndex = this.steps.indexOf(this.currentStep);
    const nextStepIndex = currentStepIndex + 1;

    if (nextStepIndex === this.steps.length) {
        return this.showSummary();
    }

    this.currentStep = this.steps[nextStepIndex];
    this.stepTitleElement.textContent = this.currentStep.title;

    this.processMappings();
    this.currentStep.show();

    this.previousActionElement.style.display = 'block';
    this.setNextButtonAvailability(this.currentStep.isJumpToNextStepAllowed());
    this.progressBarElement.style.width = `${(100 * nextStepIndex)/(this.steps.length)}%`;
}

Wizard.prototype.showSummary = function() {
    this.progressBarElement.parentNode.style.display = 'none';
    this.stepTitleElement.style.display = 'none';
    this.actionsElement.style.display = 'none';
    this.summary.show(this.values);
}

Wizard.prototype.processMappings = function() {
    const { swallowCompare } = helper;

    const newMappings = this.currentStep.mapWizardValues(this.values);
    const mappings = this.stepMappings[this.currentStep.stepId];
    
    this.stepMappings[this.currentStep.stepId] = newMappings;

    const isEqual = swallowCompare(mappings, newMappings);

    if (!isEqual) {
        this.currentStep.synchronizeWithWizard(newMappings);
    }
}

Wizard.prototype.jumpToPreviousStep = function() {
    const currentStepIndex = this.steps.indexOf(this.currentStep);

    if (currentStepIndex === 0) {
        return false;
    }

    this.currentStep.hide();

    this.currentStep = this.steps[currentStepIndex - 1];
    const newStep = this.steps[currentStepIndex - 1];
    
    this.setNextButtonAvailability(newStep.isJumpToNextStepAllowed());
    this.progressBarElement.style.width = `${100 * (currentStepIndex - 1)/this.steps.length}%`;
    this.stepTitleElement.textContent = this.currentStep.title;
    if (currentStepIndex - 1 === 0) {
        this.previousActionElement.style.display = 'none';
    }

    newStep.show();
}

Wizard.prototype._reconstructDOM = function() {
    const { findStepsElements, findSummaryElement, emptyElement } = helper;

    const stepElements = findStepsElements(this.element);
    const summaryElement = findSummaryElement(this.element);

    emptyElement(this.element);

    const content = document.createElement('div');
    content.classList.add('content');

    this._createSteps(stepElements);
    this._createStepTitlesDOM(this.currentStep.title);
    this._createSummary(summaryElement);
    this._createActionsDOM();

    this.setNextButtonAvailability(this.currentStep.isJumpToNextStepAllowed());

    this.steps.forEach(step => {
        content.append(step.element);
    });

    content.appendChild(this.summary.element);

    this.element.appendChild(this.stepTitleElement);
    this.element.appendChild(this._createProgressBar());
    this.element.appendChild(content);
    this.element.appendChild(this.actionsElement);
}

Wizard.prototype._createStepTitlesDOM = function(stepTitle) {
    this.stepTitleElement = document.createElement('div');
    this.stepTitleElement.classList.add('step-title');
    this.stepTitleElement.textContent = stepTitle;
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

    this.nextActionElement.addEventListener('click', () => {
        if (this.currentStep.validate()) {
            this.jumpToNextStep();      
        }
    })

    this.previousActionElement.addEventListener('click', event => {
        this.jumpToPreviousStep();
    });

    this.actionsElement = actionsElement;

    this.actionsElement.classList.add('actions');
    this.actionsElement.appendChild(previousActionElement);
    this.actionsElement.appendChild(nextActionElement);
}

Wizard.prototype._createSummary = function(summaryElement) {
    let summary = this.processSummary(summaryElement);

    if (!(summary instanceof Summary)) {
        summary = new Summary(summaryElement);
    }

    summary.element.style.display = 'none';

    this.summary = summary;
}

Wizard.prototype._createSteps = function(stepElements) {
    this.steps = [];

    const update = this.update.bind(this);

    stepElements.forEach(stepElement => {
        const wizardId = stepElement.getAttribute('wizard-id');
        const wizardTitle = stepElement.getAttribute('wizard-title');
        let step = this.processStep(stepElement, wizardId, wizardTitle, update);

        if (!(step instanceof Step)) {
            step = new Step(stepElement, wizardId, wizardTitle, update);
        }

        this.stepMappings[step.stepId] = Object.create(null);
        this.steps.push(step);
    });
    
    const [ firstStep ] = this.steps;
    this.currentStep = firstStep;

    firstStep.show();
}

Wizard.prototype._createProgressBar = function() {
    const progressElement = document.createElement('div');
    progressElement.classList.add('progress');

    this.progressBarElement = document.createElement('div');
    this.progressBarElement.classList.add('progress-bar');

    progressElement.appendChild(this.progressBarElement);

    return progressElement;
}