﻿let testInheritance = async (): Promise<void> => {

    const dependencyManager = Bit.DependencyManager.getCurrent();
    const contextProvider = dependencyManager.resolveObject<Bit.Contracts.IEntityContextProvider>("EntityContextProvider");
    const odataContext = await contextProvider.getContext<TestContext>("Test");

    let newInheritedDtoInstance = new Bit.Tests.Model.Dto.SampleInheritedDto();

    expect(newInheritedDtoInstance instanceof Bit.Tests.Model.Dto.SampleBaseDto).toBeTruthy();

    newInheritedDtoInstance = (await odataContext.sampleInherited.getSampleDto());

    expect(newInheritedDtoInstance instanceof Bit.Tests.Model.Dto.SampleBaseDto).toBeTruthy();
    expect(newInheritedDtoInstance instanceof Bit.Tests.Model.Dto.SampleInheritedDto).toBeTruthy();
    expect(newInheritedDtoInstance.lastName).toBe("1");
    expect(newInheritedDtoInstance.name).toBe("1");
}