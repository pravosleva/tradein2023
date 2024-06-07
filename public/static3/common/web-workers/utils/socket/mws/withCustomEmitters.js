// NOTE: NES is gloal for this

const withCustomEmitters = ({
  eventData,
  socket,
}) => {
  const {
    __eType,
    input,
    specialClientKey,
  } = eventData

  // - NOTE: Level 1: Client -> Worker communication events
  switch (__eType) {
    case NES.Custom.EType.CLIENT_TO_WORKER_MESSAGE: {
      
      // -- NOTE: Level 2: Different app event types
      switch (true) {
        case eventData?.input?.metrixEventType === NES.Socket.Metrix.EClientOutgoing.SP_MX_EV: {
          let outputData = {
            ...input,
            specialClientKey,
          }

          // --- NOTE: Level 3: Internal app state handlers
          switch (true) {
            // === NOTE: Hard logs
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.AppInitErr:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.SendImeiErr:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.EnterMemoryAndColor:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.PrePriceTable:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.CheckPhone:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.GetPhotoLink:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.UploadPhotoResultIsFuckup:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.FinalPriceTable:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.Contract:
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.ContractSending:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.ContractError:
            case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.Final:
              socket.emit(input.metrixEventType, {
                ...outputData,
                _wService: {
                  _perfInfo,
                },
              }, (r) => {
                log({ label: 'c->sw:port:listener:metrixEventType:detailed->s->[cb]', msgs: [r] })
              })
              break
            // ===
            // === NOTE: Lite logs
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.AppInit:
            // case eventData?.input.stateValue === NES.Custom.Client.EStepMachine.ContractSending:
            default:
              socket.emit(input.metrixEventType, outputData, (r) => {
                log({ label: 'c->sw:port:listener:metrixEventType:default->s->[cb]', msgs: [r] })
              })
              break
            // ===
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
