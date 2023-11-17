let supported = null;
async function modulesSupported() {
   if (typeof supported === 'boolean') return supported;

   try {
     let module = await new Function("return (async () => {return await import('data:application/javascript,export%20let%20canary%20=%201;')})")()()
     supported = module && module.canary && module.canary == 1;
   } catch(e) {
     supported = false;
   }

   return supported;
}

modulesSupported()
  .then((ok) => {
    // NOTE: boolean
    console.log(`modulesSupported is: ${ok}`);
    if (!ok) {
      try {
        customEruda.initIfNecessary();
      } catch (err) {
        console.warn(err)
      } finally {
        window.alert("Modern browsers know both type=module and nomodule, so skip this");
        window.alert("Old browsers ignore script with unknown type=module, but execute this.");
      }
    }
  })
  .catch((err) => window.alert(err.message || 'WTF'));
