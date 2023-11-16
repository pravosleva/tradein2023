```ts
// NOTE: https://t.me/c/1615277747/4221
export type TUserDataResponse = {
  ok: boolean;
  message?: string;

  // NOTE: Данные для отображения в ui:
  user_data: {
    partner: string;
    display_name: string;
  };

  // NOTE: Данные конкретной сессии:
  session_data: {
    tradein_id: number;
    // Видел в коде, что csrftoken где-то вставляется явно в заголовок,
    // но в наших флоу такого нет, поэтому он пока не нужен, пусть остается в куках
  };

  // NOTE: Перечислены достойные внимания фичи (по мере доработки флоу)
  features: {
    // NOTE: Phone number mask
    country_code: ECountryCode;

    // NOTE: Выбор типа устройства [Смартфоны / Планшеты] or [Смарт-часы]
    smartwatch_allowed: boolean;

    // NOTE: IS_TRYING_ADD_CARD_FEATURE_ENABLED
    // partner_is_sberlike: boolean;

    // NOTE: IS_PARTNER_KZLIKE -(не важно)
    // t_require_iin: boolean;

    // NOTE: IS_DIRECT_BUYOUT_VERIFIED
    // t_direct_buyout_verified_via_api: boolean;

    // NOTE: IS_OFFLINE_BUYOUT_SMS_ENABLED
    // t_offline_buyout_sms: boolean;
    // После /partner_api/tradein/client/data делается
    // запрос /partner_api/tradein/buyout_doc/send_sms_code (data: { id: tradeinId })
    // -> ok
    //    runSberModal
    //      preConfirm: 4 symbols, /partner_api/tradein/buyout_doc/sign_by_sms_code (data: { id: tradeinId, sms_code: text })
    //        => ok: if (!!res.barcode_url) window.proxiedState.barcodeUrl = res.barcode_url
    //               if (!!res.barcode) window.proxiedState.barcode = res.barcode
    //        
    //      retryOpts: { url: '/partner_api/tradein/buyout_doc/send_sms_code',
    //      goFinalStep:
    //        isPartnerSberLike -> success msg 'Договор подписан' -> get_block_by_step('final_buyout_sms')
    //        default: fuckup msg кейс не предусмотрен для партнера -> get_block_by_step('final_buyout_sms') // NOTE: Added by Pasha
    //  -case window.IS_DIRECT_BUYOUT_VERIFIED && !window.IS_PARTNER_KZLIKE:
    //  case _service.scenario === SCENARIO_CODE.MTSMAIN_LIKE_2023:
    // if (!!window.proxiedState.barcodeUrl) {
    // modalsMagic.runPollingInModal({
    //   url: `${getAPIBaseUrl()}/partner_api/tradein/wait_for/verified`,
    //   getData: () => {
    //     const body = { id: window.proxiedState.tradeinId }
    //     if (window.proxiedState.devtool.isDev) body.odd_success = 5
    //     if (window.proxiedState.devtool.isDev) body.random_success = true
    //     return body
    //   },
    //   reqOpts: {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //   },
    //   conditionToRetry: (res) => res.ok && !!res.should_wait,
    //   interval: 1000,
    //   createContentFn: (content) => {
    //     const internalContent = modalsMagic.getBarcodeVerifyWaitingContent({
    //       specialText:
    //         'Отсканируйте данный штрих-код в 1С и дождитесь в этом окне сообщения о результате',
    //       barcodeUrl: window.proxiedState.barcodeUrl,
    //       barcode: window.proxiedState.barcode,
    //     })
    //     content.appendChild(internalContent)
    //   },
    //   onSuccess: ({ originalResponse }) => {
    //     spm.reportErr({
    //       err: {
    //         tradeinId: window.proxiedState.tradeinId,
    //         partnerName: window.PARTNER,
    //         csrfToken: $('[name=csrfmiddlewaretoken]').val(),
    //         message: 'gDebug',
    //         // 'imeiStep.__response': window.proxiedState.imeiStep.__response,
    //         res: originalResponse,
    //       },
    //       about: '[6] mtsmain',
    //       eventCode: 'mtsmain2023_verified_ok',
    //       whatHaveWeDone: `runPollingInModal /partner_api/tradein/wait_for/verified-> onSuccess -> Success modal with res.message (or default): "${
    //         originalResponse?.message || 'Выплата произведена'
    //       }"`,
    //       _partnerSettingsDebug: {
    //         namespace: 'mtsmain2023',
    //         testedSettings: {
    //           // NOTE: Используемые в этом коде параметры
    //           t_offline_buyout_sms: window.IS_OFFLINE_BUYOUT_SMS_ENABLED,
    //           partner_is_sberlike: window.IS_TRYING_ADD_CARD_FEATURE_ENABLED,
    //           t_require_iin: window.IS_PARTNER_KZLIKE,
    //           // NOTE: Как настроен mtsmain (их там нет, wtf?): https://t.me/c/1482327140/17118
    //         },
    //       },
    //     })
    //     if (!window.proxiedState.devtool.isDev) spm.ymSber('reachGoal', 'dkp_signed')
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Операция успешно завершена',
    //       showConfirmButton: true,
    //       confirmButtonColor: '#168f48',
    //       backdrop: true,
    //       // timer: 1000,
    //       allowOutsideClick: () => false,
    //     })
    //       .then(({ isConfirmed }) => {
    //         if (isConfirmed) window.location.href = '/tradein/'
    //         else throw new Error('INCORRECT CASE')
    //       })
    //       .catch((err) => {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Ошибка',
    //           text: err.message || 'No err.message',
    //           showConfirmButton: true,
    //         })
    //       })
    //   },
    //   onError: (err) => {
    //     groupLog('payout_card', 'onError', [err])
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Oops!',
    //       text: err.message || 'No err.message',
    //       showConfirmButton: true,
    //     })
    //   },
    //   isDevModeEnabled: false, // window.proxiedState.devtool.isDev,
    // })
    //  case window.IS_PARTNER_KZLIKE: (не важно)
    //  -default: baseFn()
    //    const baseFn = () => {
            // if (!window.proxiedState.devtool.isDev) spm.ymSber('reachGoal', 'dkp_signed')
          //   switch (true) {
          //     case isPartnerSberLike:
          //       switch (true) {
          //         default:
          //           Swal.fire({
          //             icon: isOk ? 'success' : 'error',
          //             title: 'Договор подписан',
          //             html: `<b>${originalResponse?.message || 'Выплата произведена'}</b>`,
          //             showConfirmButton: true,
          //             confirmButtonColor: '#168f48',
          //           })
          //           // --- TODO: Should be tested
          //           // get_block_by_step('checktake');
          //           get_block_by_step('final_buyout_sms')
          //           // ---
          //           break
          //       }
          //       break
          //     default:
          //       const uiMsg = `Кейс не предусмотрен для партнера ${window.PARTNER}; Проверьте набор фич`
          //       spm.reportErr({
          //         err: result,
          //         about:
          //           'personal step -> /partner_api/tradein/client/data -> runSberModal -> goFinalStep: !isPartnerSberLike',
          //         eventCode: 'user_flow_err',
          //         whatHaveWeDone: `extraErrModal: ${uiMsg}`,
          //         cb: (msg) => {
          //           extraErrModal(`${!!msg ? `${msg} ` : ''}${uiMsg}`)
          //           get_block_by_step('final_buyout_sms') // NOTE: Added by Pasha
          //         },
          //       })
          //       break
          //   }
          // }
    // -> err msg
  }
};
```