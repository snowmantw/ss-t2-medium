(function() {
window.Main = 
{
  // Initialize the environment.
  // It's not a part of our program, and like the CLR for C/C++.
   init: function m_init()
  {
    fluorine.infect()
    Notifier.init()
    UI(document).forward('ready', function()
    {
      return 'initialize'
    }).done()()
  }

  ,main: function m_main()
  {
    Event('initialize')
      .done()()
  }
}
})();

Main.init()
Main.main()
