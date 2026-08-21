using System;
using System.Reflection;
using System.ComponentModel;
using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoPluginContainer.ViewModel
{
    public abstract class SingletonViewModelBase<TClass> : INotifyPropertyChanged
    {
        protected static volatile object single = new object();
        protected string VMKey;
        private static ConcurrentDictionary<string, TClass> ObjectDic = new ConcurrentDictionary<string, TClass>();

        public string ViewModelKey
        {
            get { return this.VMKey; }
        }

        public static void RemoveInstance(string viewModelKey)
        {
            lock (single)
            {
                if (ObjectDic.ContainsKey(viewModelKey))
                {
                    TClass d;
                    ObjectDic.TryRemove(viewModelKey, out d);
                }
            }
        }

        public static TClass GetInstance(string viewModelKey)
        {
            if (System.Reflection.Assembly.GetExecutingAssembly().Location.Contains("VisualStudio"))
            {
                return default(TClass); 
            }
            else
            {
                lock (single)
                {
                    if (!ObjectDic.ContainsKey(viewModelKey))
                    {
                        TClass mv = (TClass)Activator.CreateInstance(typeof(TClass), BindingFlags.Instance | BindingFlags.NonPublic, null, new object[] { viewModelKey }, null);
                        ObjectDic.TryAdd(viewModelKey, mv);
                    }
                }
            }

            return ObjectDic[viewModelKey];
        }

        public static void ClearInstance(string viewModelKey)
        {
            if (System.Reflection.Assembly.GetExecutingAssembly().Location.Contains("VisualStudio"))
            {

            }
            else
            {
                lock (single)
                {
                    if (ObjectDic.ContainsKey(viewModelKey))
                    {
                        TClass mv;
                        ObjectDic.TryRemove(viewModelKey, out mv);
                    }
                }
            }
        }

        #region INotifyPropertyChanged 멤버
        [field: NonSerializedAttribute()]
        public event PropertyChangedEventHandler PropertyChanged;

        public void SetValue<T>(ref T property, T value, [CallerMemberName] string propertyName = null)
        {
            if (property != null)
            {
                if (property.Equals(value)) return;
            }
            OnPropertyChanged(propertyName);
            property = value;
        }

        public void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChangedEventHandler handler = this.PropertyChanged;
            if (handler != null)
            {
                handler(this, new PropertyChangedEventArgs(propertyName));
            }
        }
        #endregion
    }
}
