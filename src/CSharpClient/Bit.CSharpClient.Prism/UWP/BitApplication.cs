﻿#if UWP
using Bit.ViewModel;
using System.Linq;
using System.Reflection;
using Windows.UI.Xaml;
using Xamarin.Essentials;

namespace Bit.UWP
{
    public class BitApplication : Windows.UI.Xaml.Application
    {
        public BitApplication()
        {
            UnhandledException += BitApplication_UnhandledException;
        }

        private void BitApplication_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            e.Handled = true;
            BitExceptionHandler.Current.OnExceptionReceived(e.Exception);
        }

        /// <summary>
        /// Configures VersionTracking | RgPluginsPopup | BitCSharpClientControls (DatePicker, Checkbox, RadioButton, Frame)
        /// </summary>
        protected virtual void UseDefaultConfiguration()
        {
            VersionTracking.Track();
            Rg.Plugins.Popup.Popup.Init();
            BitCSharpClientControls.Init();
        }

        /// <summary>
        /// BitCSharpClientControls | RgPluginsPopup
        /// </summary>
        protected virtual Assembly[] GetBitRendererAssemblies()
        {
            return new[] { typeof(BitCSharpClientControls).GetTypeInfo().Assembly }
                .Union(Rg.Plugins.Popup.Popup.GetExtraAssemblies())
                .ToArray();
        }
    }
}
#endif