'use strict';

angular.module('cpxApp')
  .service('cpx', function ($log, $sessionStorage, scroll, bic, $timeout,
                            cpxwelcome, cpxeligibility, cpxcalculation, cpxpolicy, cpxapply, cpxdetails) {

    const CPX_SESSION_STORAGE_KEY = '_cpx';
    let cpxFormCache;

    this.getCurrentModel = getCurrentModel;
    this.stepBack = stepBack;
    this.completeStep = completeStep;
    this.uncompleteStep = uncompleteStep;
    this.resetCurrentForm = resetCurrentForm;
    this.scrollToStep = scrollToStep;
    this.getCpxForm = getCpxForm;
    this.exportCpxFormBase64 = exportCpxFormBase64;
    this.importCpxFormBase64 = importCpxFormBase64;

    $log.debug('Init model', getCurrentModel());

    this.flow = getFlow();

    function scrollToStep(stepName){
      return scroll.scrollTo(document.getElementById(`step-${stepName}`));
    }

    function stepBack(currentStepName){
      return scrollToStep(getFlow()[getFlow().indexOf(currentStepName) - 1]);
    }

    function resetCurrentForm(){
      _(getFlow()).forEach(step => {
        return $sessionStorage[CPX_SESSION_STORAGE_KEY][step] = {};
      });
      $sessionStorage[CPX_SESSION_STORAGE_KEY] = {};

      window.location.reload();
    }

    function completeStep(stepName){
      getCurrentModel()[stepName] = getCurrentModel()[stepName] || {};

      let stepModel = getCurrentModel()[stepName];
      $log.debug(`Completing step ${stepName}`, stepModel);

      if(stepModel.complete) {
        //We have already completed this step - scroll to the next section
        return $timeout(() => {
          scrollToStep(getNextStep(stepName));
        }, 100);
      }
      else {
        return stepModel.complete = true;
      }
    }

    function uncompleteStep(stepName){
      let flow = getFlow();
      let stepIndex = flow.indexOf(stepName);
      _(flow).forEach((step, index) => {
        if(index >= stepIndex){
          $log.debug(`CPX Uncompleting ${step}`);
          getCurrentModel()[step] = getCurrentModel()[step] || {};
          getCurrentModel()[step].complete = false;
        }
      });
    }

    function getNextStep(stepName){
      let flow = getFlow();
      let stepIndex = flow.indexOf(stepName) + 1;
      return stepIndex < flow.length ? flow[stepIndex] : undefined;
    }

    function getPreviousStep(stepName){
      let flow = getFlow();
      let stepIndex = flow.indexOf(stepName) - 1;
      return stepIndex >= 0 ? flow[stepIndex] : undefined;
    }

    function getFlow(){
      //TODO cache this
      return _.map(getCpxForm(), step => step.name);
    }

    function getCurrentModel () {
      let model = $sessionStorage[CPX_SESSION_STORAGE_KEY] ?
        $sessionStorage[CPX_SESSION_STORAGE_KEY] :
        $sessionStorage[CPX_SESSION_STORAGE_KEY] = {};

      //model.isLoaded = false;
      //$timeout(() => {model.isLoaded = true}, 500);

      return model;
    }

    function exportCpxFormBase64(){
      return btoa(JSON.stringify(getCurrentModel()));
    }

    function importCpxFormBase64(base64){
      return JSON.parse(atob(base64));
    }

    function isComplete(namespace){
      return () => {
        return getCurrentModel() && getCurrentModel()[namespace] && getCurrentModel()[namespace].complete === true;
      }
    }


    //  isActive: () => { return this.welcome.isComplete() && this.elegibility.isComplete() && this.calculation.isComplete() && this.policy.isComplete(); },

    function isActive(namespace){
      return () => {
        let flow = getFlow();
        let stepIndex = flow.indexOf(namespace);
        let previousStep = getPreviousStep(namespace);

        let isActive = ! isComplete(namespace)();
        for(let i = stepIndex; i >= 0; i--){

          if(previousStep && ! isComplete(previousStep)()){
            isActive = false;
          }

          previousStep = getPreviousStep(previousStep)
        }
        return isActive;
      }
    }

    function isDisplayed(namespace){
      return () => {
        return isComplete(getPreviousStep(namespace))();
      };
    }


    function getCpxForm(){

      return cpxFormCache ? cpxFormCache : cpxFormCache = [
        {
          name: 'welcome',
          title: 'Welcome to the <b>Cover&nbsp;Plus&nbsp;Extra</b> service',
          icon: '/assets/svg/visual.svg',
          fields: cpxwelcome.getWelcomeFields(),
          isDisplayed: () => { return true; },
          isActive: isActive('welcome') ,
          isComplete: isComplete('welcome')
        },
        {
          name: 'elegibility',
          title: 'Elegibility',
          fields: cpxeligibility.getElegibilityFields(),
          isDisplayed: isDisplayed('elegibility'),
          isActive: isActive('elegibility'),
          isComplete: isComplete('elegibility')
        },
        {
          name: 'calculation',
          title: 'Calculation',
          fields: cpxcalculation.getCalculationFields(),
          isDisplayed: isDisplayed('calculation'),
          isActive: isActive('calculation'),
          isComplete: isComplete('calculation')
        },
        {
          name: 'policy',
          title: 'Policy',
          fields: cpxpolicy.getPolicyFields(),
          isDisplayed: isDisplayed('policy'),
          isActive: isActive('policy'),
          isComplete: isComplete('policy')
        },
        {
          name: 'apply',
          title: 'Apply',
          fields: cpxapply.getApplyFields(),
          isDisplayed: isDisplayed('apply'),
          isActive: isActive('apply'),
          isComplete: isComplete('apply')
        },
        {
          name: 'details',
          title: 'Details',
          fields: cpxdetails.getDetailsFields(),
          isDisplayed: isDisplayed('details'),
          isActive: isActive('details'),
          isComplete: isComplete('details')
        }
      ]
    }



  });
