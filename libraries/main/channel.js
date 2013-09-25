// A customized Fluorine context to hold and forward channel events.

(function() {

self.Channel = function(a)
{
  return new self.Channel.o(a)
}

self.Channel.o = function(a)
{
  this.__channel = null
  this.__socket = null
  this.__fwd_registry = {}

  Context.o.call(this, a)
}

// Extends the basic context.
_.extend( self.Channel.o.prototype, self.Context.o.protype)

self.Channel.o.prototype = _.extend
( self.Channel.o.prototype ,
{
  // Parsing the message and dispatch it according to the head's 'type'.
  //
  // JSON -> ()
  __onmessage: function ch___onmessage(json_msg)
  {
    let message = JSON.parse(json_msg)
    let type = message.head.type

    // Find the forwarding function and call it.
    this.__fwd_registry[type](message)
  }

  // Will start the channel, include get token from server.
  // Because the socket/channel is naturally event-driven,
  // all we need to do is forward every events to Notifier in the following steps.
  //
  // () -> Channel Token -> Channel ()
  ,connect: function ch_init()
  {
    this.__process.next( _.bind( function _ch_init(tk)
    {
      this.__channel = new goog.appengine.Channel(tk)
      this.__socket  = this.__channel.open()

      // Set it to dispatch the messages according to the type.
      this.__socket.onmessage = self.Channel.o.__onmessage
    }, this), 'Channel::connect')
    return this
  }

  // Forward native events like 'open' to application event.
  // The lastest binding one will overwrite the old ones,
  // and this may be fixed in the future by namespacing.
  //
  // String -> (() -> String) -> Channel ()
  ,forward: function ch_forward(type, fn)
  {
    this.__process.next( _.bind( function _ch_forward()
    {
      // Hook every native events with a function that forward it as new events.
      // In fact we had already bind the native methods to dispatching functions.

      // Some basic types:
      if('open' === type)
      {
        this.__socket.onopen = fn
      }
      else if('close' === type)
      {
        this.__socket.onclose = fn
      }
      else if('error' === type)
      {
        this.__socket.onerror = fn
      }
      // Customizable types from the 'message' native event:
      else
      {
        this.__fwd_registry[type] = fn
      }
    }, this), 'Channel::forward')
    return this
  }
})

})();
