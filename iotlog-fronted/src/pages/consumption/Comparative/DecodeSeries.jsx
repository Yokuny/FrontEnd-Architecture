import * as pb from 'protobufjs';

const x0a4f9c3d = 'aYzNsdWRHRjRJRDBnSW5CeWIzUnZNeUk3Q2lBZ0lDQWdJSEJoWTJ0aFoyVWdkR2x0WlhObGNtbGxjenNLQ2lBZ0lDQWdJRzFsYzNOaFoyVWdVMjkxY21ObElIc0tJQ0FnSUNBZ0lDQmtiM1ZpYkdVZ2RtRnNkV1VnUFNBeE93b2dJQ0FnSUNBZ0lITjBjbWx1WnlCMWJtbDBJRDBnTWpzS0lDQWdJQ0FnZlFvS0lDQWdJQ0FnYldWemMyRm5aU0JVYVcxbFUyVnlhV1Z6SUhzS0lDQWdJQ0FnSUNCa2IzVmliR1VnZEdsdFpYTjBZVzF3SUQwZ01Uc0tJQ0FnSUNBZ0lDQlRiM1Z5WTJVZ1kyOXVjM1Z0Y0hScGIyNU5ZVzUxWVd3Z1BTQXlPd29nSUNBZ0lDQWdJRk52ZFhKalpTQmpiMjV6ZFcxd2RHbHZibFJsYkdWdFpYUnllU0E5SURNN0NpQWdJQ0FnSUgwS0NpQWdJQ0FnSUcxbGMzTmhaMlVnVkdsdFpWTmxjbWxsYzBOdmJHeGxZM1JwYjI0Z2V3b2dJQ0FnSUNBZ0lISmxjR1ZoZEdWa0lGUnBiV1ZUWlhKcFpYTWdjMlZ5YVdWeklEMGdNVHNLSUNBZ0lDQWdmUT09';

const f8b2e35c = (data) => {
  return atob(data);
};

const c9e3b2a5 = (encoded) => {
  return atob(encoded);
};

export const loadAndGet = () => {
  const d5c7b2a8 = c9e3b2a5(f8b2e35c(x0a4f9c3d.slice(1)));
  return pb.Root.fromJSON(pb.parse(d5c7b2a8).root);
};
