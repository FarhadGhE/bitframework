﻿module Bit.Components {

    @ComponentDependency({
        name: "persianDatePicker",
        require: {
            "ngModelController": "ngModel",
            "mdInputContainer": "^?mdInputContainer"
        },
        bindings: {
            "ngModel": "=",
            "isDateTime?": "="
        },
        template: ["$element", "$attrs", ($element: JQuery, $attrs: ng.IAttributes) => {

            return `<persian-date-element>
                        <input id='display' type='text'></input>
                        <input id='value' class='persian-date-picker-value' ng-model='vm.ngModel' type='hidden'></input>
                    <persian-date-element>`;

        }]
    })
    export class PersianDateComponent {

        public constructor(@Inject("$scope") public $scope: ng.IScope, @Inject("$element") public $element: JQuery, @Inject("DateTimeService") public dateTimeService: Contracts.IDateTimeService) {
        }

        public isDateTime: boolean;
        public ngModel: Date;
        public ngModelController: ng.INgModelController;
        public $display: JQuery;
        public $value: JQuery;
        public mdInputContainer: {
            element: JQuery
        };

        public async $onInit(): Promise<void> {

            if (jQuery["persian-date-picker-val-override-is-configured"] != true) {

                let jQueryOriginalVal = jQuery.fn.val;

                jQuery.fn.val = (function (value) {
                    let result = jQueryOriginalVal.apply(this, arguments);
                    if (arguments.length == 1 && this.hasClass("persian-date-picker-value")) {
                        this.trigger("change");
                    }
                    return result;
                }) as any;

                jQuery["persian-date-picker-val-override-is-configured"] = true;

            }

            this.isDateTime = this.isDateTime || false;

            this.ngModelController.$formatters = this.ngModelController.$formatters || [];

            this.ngModelController.$formatters.push((value: Date): string => {

                if (this.ngModelController.$isEmpty(value)) {
                    if (this.$display != null) {
                        this.$display.val(null);
                    }
                    if (this.mdInputContainer != null) {
                        this.mdInputContainer.element.removeClass("md-input-has-value");
                    }
                    return null;
                } else {
                    const result = new Date(value);

                    let formattedResult: string;

                    if (this.isDateTime == true) {
                        formattedResult = this.dateTimeService.getFormattedDateTime(result, "FaIr");
                    } else {
                        formattedResult = this.dateTimeService.getFormattedDate(result, "FaIr");
                    }

                    if (this.$display != null) {
                        this.$display.val(formattedResult);
                    }
                    if (this.mdInputContainer != null) {
                        this.mdInputContainer.element.addClass("md-input-has-value");
                    }

                    return formattedResult;
                }
            });
        }

        public async $postLink(): Promise<void> {

            this.$display = this.$element.find("#display");
            this.$value = this.$element.find("#value");

            const isDateTime = this.isDateTime;
            const dateTimeService = this.dateTimeService;

            this.$display["persianDatepicker"]({
                autoClose: this.isDateTime == false,
                altField: this.$value,
                altFieldFormatter: (e) => {
                    const result = new Date(e);
                    return result;
                },
                formatter: (e) => {
                    const result = new Date(e);
                    if (isDateTime == true) {
                        return dateTimeService.getFormattedDateTime(result, "FaIr");
                    } else {
                        return dateTimeService.getFormattedDate(result, "FaIr");
                    }
                },
                timePicker: {
                    enabled: this.isDateTime == true
                }
            });

            this.$value.val(null); // at first date time picker will initialized with current system date

            this.$display.change(e => { // clears ngModel when user clears text box
                const val = this.$display.val();
                if (val == null || val == "") {
                    this.ngModelController.$setViewValue(null);
                }
            });

            this.$value.change((e) => {  // because this input's type is hidden
                this.$scope.$applyAsync(() => {
                    const val = this.$value.val();
                    this.ngModelController.$setViewValue(this.ngModelController.$isEmpty(val) ? null : this.dateTimeService.parseDate(val));
                });
            });
        }
    }
}