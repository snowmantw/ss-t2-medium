(function() {
window.Session = 
{
   path_channel_token: function ss_path_channel_token()
  {

  }

  // Storage session information.
  // String -> String -> IO ()
  ,set: function ss_set(k, str_v)
  {
    return IO()._(function()
      {
        window.sessionStorage.setItem(k, str_v);
      }).done()
  }

  // Get session information.
  // String -> IO String
  ,get: function ss_get(k)
  {
    return IO()._(function()
      {
        return window.sessionStorage.getItem(k);
      }).done()
  }
}
})();
