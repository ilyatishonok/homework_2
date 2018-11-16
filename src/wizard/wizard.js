function Wizard(element, processStep, processSummary) {
    this.element = element;
    this.processStep = processStep;
    this.processSummary = processSummary;
    this.steps = {};
    this.isNextButtonAvailable = true;
    this.isPreviousButtonVisible = false;
    this.values = {};
    this.stepMappings = Object.create(null);

    this.reconstructDOM();
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
        
        isAvailable ? this.nextActionElement.classList.remove('disabled')
            : this.nextActionElement.classList.add('disabled');
    }
}

Wizard.prototype.setPreviousButtonVisibility = function(stepIndex) {
    if (stepIndex === 0 && this.isPreviousButtonVisible) {
        this.isPreviousButtonVisible = false;
        this.previousActionElement.style.display = 'none';
    } else if (stepIndex !== 0 && !this.isPreviousButtonVisible) {
        this.isPreviousButtonVisible = true;
        this.previousActionElement.style.display = 'block';
    }
}

Wizard.prototype.jumpToNextStep = function() {
    this.currentStep.hide();

    const currentStepIndex = this.steps.indexOf(this.currentStep);
    const newStepIndex = currentStepIndex + 1;

    this.updateProgressBar(newStepIndex, this.steps.length);

    if (newStepIndex === this.steps.length) {
        return this.showSummary();
    }

    this.currentStep = this.steps[newStepIndex];
    this.stepTitleElement.textContent = this.currentStep.title;

    this.processMappings();

    this.setPreviousButtonVisibility(newStepIndex);
    this.setNextButtonAvailability(this.currentStep.isJumpToNextStepAllowed());

    this.currentStep.show();
}

Wizard.prototype.showSummary = function() {
    this.hideBarElements();

    this.summary.show(this.values);
}

Wizard.prototype.hideBarElements = function() {
    this.progressElement.style.display = 'none';
    this.stepTitleElement.style.display = 'none';
    this.actionsElement.style.display = 'none';
}

Wizard.prototype.updateProgressBar = function(stepIndex, stepsLength) {
    this.progressElement.firstChild.style.width = `${(100 * stepIndex)/(stepsLength)}%`;
}

Wizard.prototype.processMappings = function() {
    const { swallowCompare } = helper;
    const { stepId } = this.currentStep;

    const newMappings = this.currentStep.mapWizardValues(this.values);
    const mappings = this.stepMappings[stepId];
    
    this.stepMappings[stepId] = newMappings;

    const isEqual = swallowCompare(mappings, newMappings);

    if (!isEqual) {
        this.currentStep.synchronizeWithWizard(newMappings);
    }
}

Wizard.prototype.jumpToPreviousStep = function() {
    const currentStepIndex = this.steps.indexOf(this.currentStep);
    const newStepIndex = currentStepIndex - 1;
    
    if (newStepIndex === -1) {
        return false;
    }

    this.currentStep.hide();

    this.updateProgressBar(newStepIndex, this.steps.length);
    this.currentStep = this.steps[newStepIndex];
    this.stepTitleElement.textContent = this.currentStep.title;
    
    this.setPreviousButtonVisibility(newStepIndex);
    this.setNextButtonAvailability(this.currentStep.isJumpToNextStepAllowed());

    this.currentStep.show();
}

Wizard.prototype.reconstructDOM = function() {
    const { findStepsElements, findSummaryElement, emptyElement } = helper;

    const elementDisplay = this.element.style.display;
    const stepElements = findStepsElements(this.element);
    const summaryElement = findSummaryElement(this.element);

    this.element.style.display = 'none';
    emptyElement(this.element);

    const content = document.createElement('div');
    content.classList.add('content');

    this.createSteps(stepElements);
    this.createStepTitleDOM(this.currentStep.title);
    this.createSummary(summaryElement);
    this.createProgressBar();
    this.createActionsDOM();

    this.setNextButtonAvailability(this.currentStep.isJumpToNextStepAllowed());

    this.steps.forEach(step => {
        content.append(step.element);
    });

    content.appendChild(this.summary.element);

    this.element.appendChild(this.stepTitleElement);
    this.element.appendChild(this.progressElement);
    this.element.appendChild(content);
    this.element.appendChild(this.actionsElement);

    this.element.style.display = elementDisplay;
}

Wizard.prototype.createStepTitleDOM = function(stepTitle) {
    this.stepTitleElement = document.createElement('div');
    this.stepTitleElement.classList.add('step-title');
    this.stepTitleElement.textContent = stepTitle;
}

Wizard.prototype.createActionsDOM = function() {
    this.actionsElement = document.createElement('div');
    this.nextActionElement = document.createElement('button');
    this.previousActionElement = document.createElement('button');

    this.nextActionElement.textContent = 'Next';
    this.nextActionElement.classList.add('next-action');
    this.previousActionElement.textContent = 'Previous';
    this.previousActionElement.classList.add('previous-action');
    this.previousActionElement.style.display = 'none';

    this.nextActionElement.addEventListener('click', () => {
        if (this.currentStep.validate()) {
            this.jumpToNextStep();      
        }
    })

    this.previousActionElement.addEventListener('click', event => {
        this.jumpToPreviousStep();
    });

    this.actionsElement.classList.add('actions');
    this.actionsElement.appendChild(this.previousActionElement);
    this.actionsElement.appendChild(this.nextActionElement);
}

Wizard.prototype.createSummary = function(summaryElement) {
    let summary = this.processSummary(summaryElement);

    if (!(summary instanceof Summary)) {
        summary = new Summary(summaryElement);
    }

    summary.element.style.display = 'none';

    this.summary = summary;
}

Wizard.prototype.createSteps = function(stepElements) {
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

Wizard.prototype.createProgressBar = function() {
    this.progressElement = document.createElement('div');
    this.progressElement.classList.add('progress');

    const progressBarElement = document.createElement('div');
    progressBarElement.classList.add('progress-bar');

    this.progressElement.appendChild(progressBarElement);
}