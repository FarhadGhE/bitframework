using System;
using System.Collections.Generic;
using BitTools.Core.Contracts.TypeScriptClientProxyGenerator;
using BitCodeGenerator.Implementations.TypeScriptClientProxyGenerator.Templates;
using BitTools.Core.Model;

namespace BitCodeGenerator.Implementations.TypeScriptClientProxyGenerator
{
    public class DefaultTypeScriptClientProxyDtoGenerator : ITypeScriptClientProxyDtosGenerator
    {
        public virtual string GenerateTypeScriptDtos(IList<Dto> dtos, IList<EnumType> enumTypes, string typingsPath)
        {
            if (dtos == null)
                throw new ArgumentNullException(nameof(dtos));

            if (typingsPath == null)
                throw new ArgumentNullException(nameof(typingsPath));

            TypeScriptDtosGeneratorTemplate template = new TypeScriptDtosGeneratorTemplate
            {
                Session = new Dictionary<string, object>
                {
                    { "Dtos", dtos },
                    { "EnumTypes" , enumTypes },
                    { "TypingsPath" , typingsPath },
                    { "UseCamelCase", true }
                }
            };

            template.Initialize();

            return template.TransformText();
        }

        public virtual string GenerateJavaScriptDtos(IList<Dto> dtos, IList<EnumType> enumTypes)
        {
            if (dtos == null)
                throw new ArgumentNullException(nameof(dtos));

            JavaScriptDtosGeneratorTemplate template = new JavaScriptDtosGeneratorTemplate
            {
                Session = new Dictionary<string, object>
                {
                    { "Dtos", dtos },
                    { "EnumTypes" , enumTypes },
                    { "UseCamelCase", true }
                }
            };

            template.Initialize();

            return template.TransformText();
        }
    }
}