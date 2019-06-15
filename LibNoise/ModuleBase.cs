using System;
using System.Collections.Generic;

namespace LibNoise
{
    public abstract class ModuleBase
    {
        private readonly List<ModuleBase> modules;

        public ModuleBase(int count)
        {
            modules = count > 0 ? new List<ModuleBase>(count) : new List<ModuleBase>();
        }

        public ModuleBase Get(int index) => modules[index];
        public ModuleBase Set(int index, ModuleBase module) => modules[index] = module;

        public int Length => modules.Count;

        public abstract float GetValue(float x, float y, float z);
    }

}
