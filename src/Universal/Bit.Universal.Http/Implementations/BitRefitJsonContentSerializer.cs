﻿using Bit.Core.Implementations;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Refit;
using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Bit.Http.Implementations
{
    public class BitRefitJsonContentSerializer : IContentSerializer
    {
        private readonly JsonSerializerSettings _jsonSerializeSettings;
        private readonly JsonSerializerSettings _jsonDeserializeSettings;

        public BitRefitJsonContentSerializer() :
            this(DefaultJsonContentFormatter.SerializeSettings(), DefaultJsonContentFormatter.DeserializeSettings())
        {

        }

        public BitRefitJsonContentSerializer(JsonSerializerSettings jsonSerializeSettings, JsonSerializerSettings jsonDeserializeSettings)
        {
            _jsonSerializeSettings = jsonSerializeSettings;
            _jsonDeserializeSettings = jsonDeserializeSettings;
        }

        public virtual async Task<T> DeserializeAsync<T>(HttpContent content)
        {
            if (content == null)
                throw new ArgumentNullException(nameof(content));

#if DotNetStandard2_0 || UWP
            using Stream stream = await content.ReadAsStreamAsync().ConfigureAwait(false);
#else
            await using Stream stream = await content.ReadAsStreamAsync().ConfigureAwait(false);
#endif
            using StreamReader reader = new StreamReader(stream);
            using JsonTextReader jsonTextReader = new JsonTextReader(reader);
            return (await JToken.LoadAsync(jsonTextReader).ConfigureAwait(false)).ToObject<T>(JsonSerializer.Create(_jsonDeserializeSettings))!;
        }

        public virtual Task<HttpContent> SerializeAsync<T>(T item)
        {
            StringContent content = new StringContent(JsonConvert.SerializeObject(item, _jsonSerializeSettings), Encoding.UTF8, "application/json");
            return Task.FromResult<HttpContent>(content);
        }
    }
}
