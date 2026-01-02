module.exports = {
  react: {
    debug: true,

    lifecycle: {
      /**
       * Decide if you want to see Update Cycles as well
       */
      includeUpdate: false,

      /**
       * Filter for Instrumenting Lifecycle of Components / True = Will be instrumented
       */
      instrument: (filename) => {
        return false;
      },
    },

    input: {
      /**
       * Allows you to filter the instrumentation for touch events, refresh events and picker events in certain files
       * True = Will be instrumented
       */
      instrument: (filename) => {
        return true;
      },
    },
  },
  android: {
    config: `
        dynatrace {
            configurations {
                defaultConfig {
                    autoStart.enabled true
                    autoStart.applicationId 'be12e187-781a-476d-ae04-8d9df9593c2b'
                    autoStart.beaconUrl 'https://bf93286ldi.bf.dynatrace.com/mbeacon'
                    userOptIn false
                    agentBehavior.startupLoadBalancing true

                    userActions.composeEnabled false
                    debug.failOnWarnings false
                }
            }
        }
        `,
  },
  ios: {
    // Those configs are copied 1:1
    config: `
        <key>DTXApplicationID</key>
        <string>be12e187-781a-476d-ae04-8d9df9593c2b</string>
        <key>DTXBeaconURL</key>
        <string>https://bf93286ldi.bf.dynatrace.com/mbeacon</string>
        <key>DTXLogLevel</key>
        <string>ALL</string>
        <key>DTXUserOptIn</key>
        <false/>
        <key>DTXStartupLoadBalancing</key>
        <true/>
        `,
  },
};
