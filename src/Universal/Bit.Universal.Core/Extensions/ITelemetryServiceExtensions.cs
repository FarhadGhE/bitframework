﻿using Bit.Core.Implementations;
using System.Collections.Generic;

namespace Bit.Core.Contracts
{
    public static class ITelemetryServiceExtensions
    {
        public static ITelemetryService All(this IEnumerable<ITelemetryService> telemetryServices)
        {
            return new TelemetryServiceAggregator(telemetryServices);
        }
    }
}
