﻿let testFunctionCallAndTakeMethodAfterThat = async (): Promise<void> => {
    const contextProvider = Bit.DependencyManager.getCurrent().resolveObject<Bit.Contracts.IEntityContextProvider>("EntityContextProvider");
    const context = await contextProvider.getContext<TestContext>("Test");
    const testModels = await context.testModels.getTestModelsByStringPropertyValue("1").take(1).toArray();
    if (testModels.length != 1)
        throw new Error("test models are not loaded correctly");
};

let testActionCall = async (): Promise<void> => {
    const contextProvider = Bit.DependencyManager.getCurrent().resolveObject<Bit.Contracts.IEntityContextProvider>("EntityContextProvider");
    const context = await contextProvider.getContext<TestContext>("Test");
    const areEqual = await context.testModels.areEqual(10, 10);
    if (areEqual != true)
        throw new Error("are equal result is not valid");
};

let passNullTests = async (): Promise<void> => {
    const contextProvider = Bit.DependencyManager.getCurrent().resolveObject<Bit.Contracts.IEntityContextProvider>("EntityContextProvider");
    const context = await contextProvider.getContext<TestContext>("Test");
    if ((await context.testModels.actionForNullArg(null, null, null, [], [], [], "test")) != null)
        throw new Error("Null return problem");
    if ((await context.testModels.functionForNullArg(null, "test")) != null)
        throw new Error("Null return problem");
};

let testBatchCallODataFunctions = async (): Promise<void> => {
    const contextProvider = Bit.DependencyManager.getCurrent().resolveObject<Bit.Contracts.IEntityContextProvider>("EntityContextProvider");
    const context = await contextProvider.getContext<TestContext>("Test");
    const [res1, res2] = await context.batchExecuteQuery([context.testModels.getTestModelsByStringPropertyValue("1").take(1), context.testModels.getTestModelsByStringPropertyValue("2").take(1)]);
    if (res1.length != 1) {
        throw new Error("There is a problem in batch read");
    }

    if (res2.length != 1) {
        throw new Error("There is a problem in batch read");
    }
};

let testPassingArrayOfEntitiesToController = async (): Promise<void> => {

    const contextProvider = Bit.DependencyManager.getCurrent().resolveObject<Bit.Contracts.IEntityContextProvider>("EntityContextProvider");
    const context = await contextProvider.getContext<TestContext>("Test");
    const validations = [
        new Bit.Tests.Model.Dto.ValidationSampleDto({ Id: 1, RequiredByAttributeMember: "A", RequiredByMetadataMember: "B" }),
        new Bit.Tests.Model.Dto.ValidationSampleDto({ Id: 2, RequiredByAttributeMember: "B", RequiredByMetadataMember: "C" })
    ];

    let result = await context.validationSamples.submitValidations(validations, null).first();

    if (result.id != "2" || result.requiredByAttributeMember != "AA" || result.requiredByMetadataMember != "BB")
        throw new Error("IEEE754Compatibility problem");

    result = await context.validationSamples.submitValidations(validations, "A").first();

    if (result.id != "2" || result.requiredByAttributeMember != "AAA" || result.requiredByMetadataMember != "BBA")
        throw new Error("IEEE754Compatibility problem");
}

let testIEEE754Compatibility = async (): Promise<void> => {

    const contextProvider = Bit.DependencyManager.getCurrent().resolveObject<Bit.Contracts.IEntityContextProvider>("EntityContextProvider");
    const context = await contextProvider.getContext<TestContext>("Test");

    const result = await context.testModels.testIEEE754Compatibility("79228162514264337593543950335");

    if (result != "79228162514264337593543950335")
        throw new Error("IEEE754Compatibility problem");

    const result2 = await context.testModels.testIEEE754Compatibility2(2147483647);

    if (result2 != 2147483647)
        throw new Error("IEEE754Compatibility problem");

    const result3 = await context.testModels.testIEEE754Compatibility3("9223372036854775807");

    if (result3 != "9223372036854775807")
        throw new Error("IEEE754Compatibility problem");

    const result4 = await context.testModels.testIEEE754Compatibility("12.2");

    if (result4 != "12.2")
        throw new Error("IEEE754Compatibility problem");

    const result5 = await context.testModels.testIEEE754Compatibility("214748364711111.2");

    if (result5 != "214748364711111.2")
        throw new Error("IEEE754Compatibility problem");

    const result6 = await context.testModels.testIEEE754Compatibility("214748364711111");

    if (result6 != "214748364711111")
        throw new Error("IEEE754Compatibility problem");

    if (new Bit.Implementations.DefaultMath().sum("123456789123456789", "123456789123456789") != (await context.testModels.testDecimalSum("123456789123456789", "123456789123456789"))) {
        throw new Error("IEEE754Compatibility problem");
    }
};