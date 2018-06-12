/**
 * Valid Icons can be found at https://material.io/tools/icons/?style=baseline
 *
 * Reroute must be a valid route within the application
 * @example
 * {
 * icon: 'event',
 * reroute: '/path/to/events/page',
 * description: 'Current events everyone can go to!',
 * header: 'Events'
 * }
 */
export interface Feature {
  icon: string;
  header: string;
  description: string;
  reroute: string;
  logoBackgroundColor?: string;
  featureBackgroundColor?: string;
}
