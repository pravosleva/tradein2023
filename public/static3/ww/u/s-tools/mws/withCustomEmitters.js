const withCustomEmitters = ({
  eventData,
  socket,
}) => {
  const {
    __eType,
    input,
  } = eventData

  // - NOTE: Level 1: Client-Worker events
  switch (__eType) {
    case NES.Custom.EType.CLIENT_TO_WORKER_MESSAGE: {
      
      // -- NOTE: Level 2: Different app event types
      switch (true) {
        case eventData?.input?.metrixEventType === NES.Socket.Metrix.EClientOutgoing.SP_MX_EV: {
          let outputData = input

          // --- NOTE: Level 3: Internal app state handlers
          switch (true) {
            // Hard logs
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.AppInitErr:
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.FinalPriceTable:
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.Contract:
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.ContractSending:
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.ContractError:
            //   outputData = {
            //     ...input,
            //     _wService: {
            //       _perfInfo,
            //     },
            //   }
            //   socket.emit(input.metrixEventType, outputData, (r) => {
            //     log({ label: 'c->sw:port:listener:metrixEventType:detailed->s->[cb]', msgs: [r] })
            //   })
            //   break
            // // Lite logs
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.AppInit:
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.ContractSending:
            //   socket.emit(input.metrixEventType, outputData, (r) => {
            //     log({ label: 'c->sw:port:listener:metrixEventType:default->s->[cb]', msgs: [r] })
            //   })
            //   break
            default:
              socket.emit(input.metrixEventType, outputData, (r) => {
                log({ label: 'c->sw:port:listener:metrixEventType:default->s->[cb]', msgs: [r] })
              })
              break
          }
          // ---

        }
        default: break
        
      }
      // --

      break
    }
    default: break
  }
  // -
}
