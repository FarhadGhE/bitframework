﻿module Bit.Tests.ViewModels {

    @DtoRulesDependency({ name: "ValidationSampleRules" })
    export class ValidationSampleRules extends Bit.Implementations.DtoRules<Tests.Model.Dto.ValidationSampleDto>{

        public validateMember(memberName: keyof Tests.Model.Dto.ValidationSampleDto, newValue: any, oldValue: any): void {
            if (memberName == "requiredByDtoRulesMember") {
                this.setMemberValidity("requiredByDtoRulesMember", "required", newValue != null);
            }
            super.validateMember(memberName, newValue, oldValue);
        }

    }

    @DtoViewModelDependency({ name: "FormValidationViewModel", templateUrl: "|Bit|/Bit.TSClient.AngularJS.Tests/views/tests/formValidationview.html" })
    export class FormValidationViewModel extends Bit.ViewModels.DtoViewModel<Tests.Model.Dto.ValidationSampleDto, ValidationSampleRules> {

        public constructor( @Inject("ValidationSampleRules") public validationSampleRules: ValidationSampleRules) {
            super();
            this.rules = validationSampleRules;
        }

        @Command()
        public async $onInit(): Promise<void> {
            this.model = new Tests.Model.Dto.ValidationSampleDto();
        }

        @Command()
        public submitFirstPart(form: Bit.ViewModels.DtoFormController<Tests.Model.Dto.ValidationSampleDto>): void {
            const isValid = form.isValid();
        }
    }
}