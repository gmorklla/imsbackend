// Filter to use on change stream watch
const filter = [{
        $match: {
            $or: [{
                    $and: [{
                            'fullDocument.measurement': {
                                $eq: 'cscfAcceptedRegistrations'
                            }
                        },
                        {
                            'fullDocument.moid': {
                                $eq: 'DEFAULT'
                            }
                        }
                    ]
                },
                {
                    $and: [{
                            'fullDocument.measurement': {
                                $eq: 'cscfRegistrationsFailure'
                            }
                        },
                        {
                            'fullDocument.moid': {
                                $in: [
                                    'SIPResponseCode=400',
                                    'SIPResponseCode=401',
                                    'SIPResponseCode=403',
                                    'SUM'
                                ]
                            }
                        }
                    ]
                },
                {
                    $and: [{
                            'fullDocument.measurement': {
                                $eq: 'scscfOriginatingInviteSuccessfulEstablishedNoAs'
                            }
                        },
                        {
                            'fullDocument.moid': {
                                $eq: 'sum'
                            }
                        }
                    ]
                },
                {
                    $and: [{
                            'fullDocument.measurement': {
                                $eq: 'scscfOriginatingInviteSuccessfulEstablishedToAs'
                            }
                        },
                        {
                            'fullDocument.moid': {
                                $eq: 'sum'
                            }
                        }
                    ]
                },
                {
                    $and: [{
                            'fullDocument.measurement': {
                                $eq: 'scscfOriginatingInviteCancelledBeforeEarlyDialog'
                            }
                        },
                        {
                            'fullDocument.moid': {
                                $eq: 'DEFAULT'
                            }
                        }
                    ]
                },
                {
                    $and: [{
                            'fullDocument.measurement': {
                                $eq: 'scscfOriginatingInviteNoAsFailed'
                            }
                        },
                        {
                            'fullDocument.moid': {
                                $in: ['403', '404', '407', '484']
                            }
                        }
                    ]
                },
                {
                    $and: [{
                            'fullDocument.measurement': {
                                $eq: 'scscfOriginatingInviteToAsFailed'
                            }
                        },
                        {
                            'fullDocument.moid': {
                                $in: ['403', '404', '407', '484']
                            }
                        }
                    ]
                },
                {
                    $and: [{
                            'fullDocument.measurement': {
                                $eq: 'scscfOriginatingInviteNoAsAttempts'
                            }
                        },
                        {
                            'fullDocument.moid': {
                                $eq: 'DEFAULT'
                            }
                        }
                    ]
                },
                {
                    $and: [{
                            'fullDocument.measurement': {
                                $eq: 'cscfOriginatingInviteToAsAttempts'
                            }
                        },
                        {
                            'fullDocument.moid': {
                                $eq: 'DEFAULT'
                            }
                        }
                    ]
                }
            ]
        }
    },
    {
        $project: {
            ns: 0,
            'fullDocument._id': 0
        }
    }
];

module.exports = filter;
