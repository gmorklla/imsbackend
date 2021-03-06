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
    const v1 = value(filter(data, 'cscfAcceptedRegistrations', 'DEFAULT'), hour, minute);
    const v2 = value(filter(data, 'cscfRegistrationsFailure', 'SIPResponseCode=400'), hour, minute);
    const v3 = value(filter(data, 'cscfRegistrationsFailure', 'SIPResponseCode=403'), hour, minute);
    const v4 = v1;
    const v5 = value(filter(data, 'cscfRegistrationsFailure', 'SUM'), hour, minute);
    const v6 = value(filter(data, 'cscfRegistrationsFailure', 'SIPResponseCode=401'), hour, minute);
    const result = 100 * (v1 + v2 + v3) / (v4 + v5 + v6);
    const obj = {
        name: 'IMSCSCFInitRegSuccRatio',
        value: result
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
    const v3 = value(filter(data, 'scscfOriginatingInviteCancelledBeforeEarlyDialog', 'DEFAULT'), hour, minute);
    const v4 = value(filter(data, 'scscfOriginatingInviteNoAsFailed', '403'), hour, minute);
    const v5 = value(filter(data, 'scscfOriginatingInviteToAsFailed', '403'), hour, minute);
    const v6 = value(filter(data, 'scscfOriginatingInviteNoAsFailed', '404'), hour, minute);
    const v7 = value(filter(data, 'scscfOriginatingInviteToAsFailed', '404'), hour, minute);
    const v8 = value(filter(data, 'scscfOriginatingInviteNoAsFailed', '407'), hour, minute);
    const v9 = value(filter(data, 'scscfOriginatingInviteToAsFailed', '407'), hour, minute);
    const v10 = value(filter(data, 'scscfOriginatingInviteNoAsFailed', '484'), hour, minute);
    const v11 = value(filter(data, 'scscfOriginatingInviteToAsFailed', '484'), hour, minute);
    const v12 = value(filter(data, 'scscfOriginatingInviteNoAsAttempts', 'DEFAULT'), hour, minute);
    const v13 = value(filter(data, 'cscfOriginatingInviteToAsAttempts', 'DEFAULT'), hour, minute);
    const result = 100 * (v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9 + v10 + v11) / (v12 + v13);
    const obj = {
        name: 'IMSCSCFOrgSessSetupSuccRatio',
        value: result
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
