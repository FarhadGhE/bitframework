﻿using Bit.Core.Implementations;
using Newtonsoft.Json;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.Support.UI;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace OpenQA.Selenium
{
    public static class IRemoteWebDriverExtensions
    {
        public static Task NavigateToRoute(this RemoteWebDriver driver, string route)
        {
            if (driver == null)
                throw new ArgumentNullException(nameof(driver));

            Uri uri = new Uri(driver.Url);

            driver.Url = $"{uri.Scheme}://{uri.Host}:{uri.Port}/{route}";

            driver.GetElementById("testsConsole");

            return Task.Delay(2500);
        }

        [DebuggerNonUserCode]
        public static IWebElement GetElementById(this RemoteWebDriver driver, string id)
        {
            if (driver == null)
                throw new ArgumentNullException(nameof(driver));

            new WebDriverWait(driver, TimeSpan.FromSeconds(2.5))
                .Until(ExpectedConditions.ElementExists(By.Id(id)));

            return driver.FindElementById(id);
        }

        [DebuggerNonUserCode]
        public static async Task ExecuteTest(this RemoteWebDriver driver, string testScript, params object[] args)
        {
            if (driver == null)
                throw new ArgumentNullException(nameof(driver));

            if (testScript == null)
                throw new ArgumentNullException(nameof(testScript));

            if (args == null)
                throw new ArgumentNullException(nameof(args));

            IWebElement testsConsole = driver.GetElementById("testsConsole");

            const string success = "Success";

            string consoleValue = testsConsole.GetAttribute("value");

            string arguments = JsonConvert.SerializeObject(args, DefaultJsonContentFormatter.SerializeSettings());

            string finalTestScript = $"executeTest({testScript},'{arguments}');";

            driver.ExecuteScript(finalTestScript);

            string value = consoleValue;
            await driver.WaitForCondition(d => testsConsole.GetAttribute("value") != value);

            consoleValue = testsConsole.GetAttribute("value");

            bool testIsPassed = consoleValue == success;

            Console.WriteLine("Test console value: " + consoleValue);
            Console.WriteLine("Url: " + driver.Url);
            Console.WriteLine("Final test script: " + finalTestScript);

            if (testIsPassed != true)
                throw new InvalidOperationException(consoleValue);
        }

        [DebuggerNonUserCode]
        public static async Task WaitForCondition(this RemoteWebDriver driver, Func<RemoteWebDriver, bool> condition)
        {
            if (driver == null)
                throw new ArgumentNullException(nameof(driver));

            if (condition == null)
                throw new ArgumentNullException(nameof(condition));

            int triesCount = 0;

            do
            {
                try
                {
                    if ((condition(driver) == true))
                        return;
                }
                catch { }
                finally
                {
                    await Task.Delay(250);
                    triesCount++;
                }
            } while (triesCount < 20);

            throw new InvalidOperationException();
        }
    }
}