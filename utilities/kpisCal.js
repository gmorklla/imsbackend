/*
IMSCSCFInitRegSuccRatio[%] =
    100 *
    (cscfAcceptedRegistrations +
    cscfRegistrationsFailure.400 +
    cscfRegistrationsFailure.403) /
    (cscfAcceptedRegistrations +
    cscfRegistrationsFailure.SUM -
    cscfRegistrationsFailure.401)
*/

function kpi1(data, time) {
    let hour;
    let minute;
    if (time) {
        hour = time.split('.')[0];
        minute = time.split('.')[1];
        minute = String(Number(minute));
    }
    const v1 = value(filter(data, 'cscfAcceptedRegistrations'), hour, minute);
    const v2 = value(filter(data, 'cscfRegistrationsFailure', 'SIPResponseCode=400'), hour, minute);
    const v3 = value(filter(data, 'cscfRegistrationsFailure', 'SIPResponseCode=403'), hour, minute);
    const v4 = v1;
    const v5 = value(filter(data, 'cscfRegistrationsFailure', 'SUM'), hour, minute);
    const v6 = value(filter(data, 'cscfRegistrationsFailure', 'SIPResponseCode=401'), hour, minute);
    const result = 100 * (v1 + v2 + v3) / (v4 + v5 + v6);
    const obj = {
        formula: '100 * (cscfAcceptedRegistrations + cscfRegistrationsFailure.400 + cscfRegistrationsFailure.403) / (cscfAcceptedRegistrations + cscfRegistrationsFailure.SUM - cscfRegistrationsFailure.401)',
        value: result,
        counters: {
            'cscfAcceptedRegistrations': v1,
            'cscfRegistrationsFailure.400': v2,
            'cscfRegistrationsFailure.403': v3,
            'cscfRegistrationsFailure.SUM': v5,
            'cscfRegistrationsFailure.401': v6
        }
    };
    return obj;
}

/*
IMSCSCFOrgSessSetupSuccRatio[%] =
    100 *
    (scscfOriginatingInviteSuccessfulEstablishedNoAs.sum +
    scscfOriginatingInviteSuccessfulEstablishedToAs.sum +
    scscfOriginatingInviteCancelledBeforeEarlyDialog +
    scscfOriginatingInviteNoAsFailed.403 +
    scscfOriginatingInviteToAsFailed.403 +
    scscfOriginatingInviteNoAsFailed.404 +
    scscfOriginatingInviteToAsFailed.404 +
    scscfOriginatingInviteNoAsFailed.407 +
    scscfOriginatingInviteToAsFailed.407 +
    scscfOriginatingInviteNoAsFailed.484 +
    scscfOriginatingInviteToAsFailed.484) /
    (scscfOriginatingInviteNoAsAttempts +
    cscfOriginatingInviteToAsAttempts)
*/

function kpi2(data, time) {
    let hour;
    let minute;
    if (time) {
        hour = time.split('.')[0];
        minute = time.split('.')[1];
        minute = String(Number(minute));
    }
    const v1 = value(filter(data, 'scscfOriginatingInviteSuccessfulEstablishedNoAs', 'sum'), hour, minute);
    const v2 = value(filter(data, 'scscfOriginatingInviteSuccessfulEstablishedToAs', 'sum'), hour, minute);
    const v3 = value(filter(data, 'scscfOriginatingInviteCancelledBeforeEarlyDialog'), hour, minute);
    const v4 = value(filter(data, 'scscfOriginatingInviteNoAsFailed', '403'), hour, minute);
    const v5 = value(filter(data, 'scscfOriginatingInviteToAsFailed', '403'), hour, minute);
    const v6 = value(filter(data, 'scscfOriginatingInviteNoAsFailed', '404'), hour, minute);
    const v7 = value(filter(data, 'scscfOriginatingInviteToAsFailed', '404'), hour, minute);
    const v8 = value(filter(data, 'scscfOriginatingInviteNoAsFailed', '407'), hour, minute);
    const v9 = value(filter(data, 'scscfOriginatingInviteToAsFailed', '407'), hour, minute);
    const v10 = value(filter(data, 'scscfOriginatingInviteNoAsFailed', '484'), hour, minute);
    const v11 = value(filter(data, 'scscfOriginatingInviteToAsFailed', '484'), hour, minute);
    const v12 = value(filter(data, 'scscfOriginatingInviteNoAsAttempts'), hour, minute);
    const v13 = value(filter(data, 'cscfOriginatingInviteToAsAttempts'), hour, minute);
    const result = 100 * (v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9 + v10 + v11) / (v12 + v13);
    const obj = {
        formula: '100 * (scscfOriginatingInviteSuccessfulEstablishedNoAs.sum + scscfOriginatingInviteSuccessfulEstablishedToAs.sum + scscfOriginatingInviteCancelledBeforeEarlyDialog + scscfOriginatingInviteNoAsFailed.403 + scscfOriginatingInviteToAsFailed.403 + scscfOriginatingInviteNoAsFailed.404 + scscfOriginatingInviteToAsFailed.404 + scscfOriginatingInviteNoAsFailed.407 + scscfOriginatingInviteToAsFailed.407 + scscfOriginatingInviteNoAsFailed.484 + scscfOriginatingInviteToAsFailed.484) / (scscfOriginatingInviteNoAsAttempts + cscfOriginatingInviteToAsAttempts)',
        value: result,
        counters: {
            'scscfOriginatingInviteSuccessfulEstablishedNoAs.sum': v1,
            'scscfOriginatingInviteSuccessfulEstablishedToAs.sum': v2,
            'scscfOriginatingInviteCancelledBeforeEarlyDialog': v3,
            'scscfOriginatingInviteNoAsFailed.403': v4,
            'scscfOriginatingInviteToAsFailed.403': v5,
            'scscfOriginatingInviteNoAsFailed.404': v6,
            'scscfOriginatingInviteToAsFailed.404': v7,
            'scscfOriginatingInviteNoAsFailed.407': v8,
            'scscfOriginatingInviteToAsFailed.407': v9,
            'scscfOriginatingInviteNoAsFailed.484': v10,
            'scscfOriginatingInviteToAsFailed.484': v11,
            'scscfOriginatingInviteNoAsAttempts': v12,
            'cscfOriginatingInviteToAsAttempts': v13
        }
    };
    return obj;
}

// Filter obj w/measurement name & moid (if provided)
const filter = (data, measurement, moid = null) =>
    moid ?
    data.filter(val => val.measurement === measurement && val.moid === moid) :
    data.filter(val => val.measurement === measurement);

// Get the value of the counter w/specific hour & minute
const value = (data, hour, minute) => {
    if (data.length > 0) {
        return data[0].values[0][hour][minute] ? Number(data[0].values[0][hour][minute]) : 0;
    } else {
        return 0;
    }
};

module.exports = {
    kpi1: kpi1,
    kpi2: kpi2
}
