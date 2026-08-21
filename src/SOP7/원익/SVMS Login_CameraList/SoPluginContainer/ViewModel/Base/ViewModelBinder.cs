using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Markup;

namespace SoPluginContainer.ViewModel
{
    public class ViewModelBinder : MarkupExtension
    {
        public ViewModelBinder() { }

        public Type ViewModelType
        {
            get;
            set;
        }

        public string VMKey
        {
            get;
            set;
        }

        public override object ProvideValue(IServiceProvider serviceProvider)
        {
            var d = ViewModelType.GetMethods(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy);

            MethodInfo method = null;

            foreach (var m in d)
            {
                if (m.Name.Equals("GetInstance") && m.GetParameters().Count() > 0)
                {

                    method = m;
                    break;
                }
            }

            if (method == null)
            {
                return null;
            }

            return method.Invoke(null, new object[] { VMKey });
        }
    }
}
