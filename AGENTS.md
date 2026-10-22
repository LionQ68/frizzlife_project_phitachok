# Frizzlife Smart Water Dashboard Instructions

## Project context

- This repository contains a frontend portfolio prototype for managing Frizzlife LPG365-series smart water monitoring and automatic shutoff devices.
- Before changing application behavior, read `PROJECT_PLAN.md` from the repository root.
- Follow `DEVELOPMENT_PHASES.md` for implementation order, phase boundaries, and completion gates.
- Treat the project plan as the source of truth for product scope, roles, screens, user flows, priorities, data structures, and acceptance criteria.
- When the latest explicit user request conflicts with the project plan, follow the user request and update the plan when requested.
- Do not claim that planned work has been implemented or tested unless it has been verified in the live repository.

## Technology

- Use React with Vite.
- Use JavaScript and JSX only. Do not add TypeScript or recreate TypeScript configuration.
- Use plain CSS with clear class names. Do not introduce a CSS framework unless the user explicitly requests it.
- Planned UI dependencies are React Router, Recharts, and Lucide React. Add dependencies only when they are needed by the requested implementation.
- Use React state, Context API when useful, mock JavaScript data, and `localStorage` for demo persistence.
- Do not add a backend, database, MQTT broker, or real device integration unless explicitly requested.

## Device model rules

- Support both `LPG365` and `LPG365-P`.
- Store the device model and supported features in mock device data through a `capabilities` object.
- `LPG365` supports Flow Rate, Water Usage, and Water Temperature.
- `LPG365-P` supports Flow Rate, Water Usage, and Water Pressure.
- Both models support leak sensors, valve control, automatic shutoff simulation, alerts, and usage history.
- Never generate or display Pressure for LPG365.
- Never generate or display Temperature for LPG365-P.
- Hide unsupported metrics or show `รุ่นนี้ไม่รองรับ`; do not display a fabricated zero value.
- Treat `3S` as a package variant for three leak sensors rather than as a separate telemetry model.

## Authentication and authorization

- Use one shared login form. Users must not select their own role.
- Mock authentication reads the account role and redirects automatically:
  - `ADMIN` to the Admin dashboard.
  - `USER` to the User dashboard.
- Demo quick-login buttons may be provided only in a clearly marked `Demo Only` section.
- Admin can view and manage all mock devices and incidents.
- User can view and control only devices assigned to that account.
- Route guards and UI permissions must enforce the role rules; hiding a menu item alone is not sufficient.
- Clearly state that authentication is simulated and is not production security.

## Safety and simulation

- Treat all telemetry, users, incidents, commands, and histories as fictional mock data.
- Label simulated information clearly in the interface.
- Do not imply a real connection to Frizzlife Cloud, physical hardware, WebSocket services, SMS, phone calls, or push notifications.
- Do not invent security certifications, protocol claims, latency values, response-time guarantees, reliability percentages, or device-scale claims.
- Require confirmation before simulated valve open and close commands.
- Disable valve opening while an active leak or Critical water incident exists.
- Resolving an incident must not automatically reopen the valve.
- Record simulated valve commands with device, action, requester, timestamp, and result.
- Simulating a leak must create a Critical alert, close the valve, and update the dashboard and event history.
- Simulator actions must respect device capabilities:
  - LPG365 may simulate abnormal temperature.
  - LPG365-P may simulate high pressure.

## UI and accessibility

- Use Thai as the primary interface language. Keep model names, common technical terms, and units in English where clearer.
- Use `GPM` for Flow Rate, `Gallons` or liters for Water Usage, `°C` for LPG365 Temperature, and `PSI` for LPG365-P Pressure.
- Use dynamic dates and times in the Asia/Bangkok timezone. Do not hard-code old dates.
- Use text and icons in addition to color for every status.
- Keep Critical alerts, active leaks, valve status, and safety restrictions visually prominent.
- Provide visible focus, hover, active, disabled, loading, empty, and error states where relevant.
- Design desktop-first while preserving usable tablet and mobile layouts.
- Keep components small, reusable, and understandable for a beginner.
- Avoid unnecessary abstractions, premature optimization, and overly clever JavaScript.

## Implementation workflow

- Inspect the existing files and preserve unrelated user changes before editing.
- Before starting every development phase, perform read-only inspection and present a phase plan to the user.
- The phase plan must state the objective, in-scope work, expected files, data decisions, acceptance criteria, verification steps, and explicit non-goals.
- Identify incomplete, ambiguous, or conflicting requirements and ask the user before making assumptions.
- Do not modify application code, install dependencies, or begin phase implementation until the user explicitly approves that phase plan.
- Approval applies only to the presented phase. Present a new plan and obtain new approval before starting the next phase.
- If approved scope must materially change during implementation, stop, explain the change, and request approval again.
- Implement the smallest complete change that satisfies the current request and the project plan.
- Reuse shared components for status badges, metric cards, sensor cards, charts, confirmation dialogs, and layout elements.
- Keep mock data and business rules out of presentational components when practical.
- Centralize model capability checks instead of scattering string comparisons throughout page components.
- Do not implement P2 features while P0 work remains unless the user explicitly changes the priority.
- Do not commit, push, deploy, upload, or connect external services unless explicitly requested.

## Verification

- Run `npm run lint` after meaningful code changes.
- Run `npm run build` before reporting implementation complete.
- Test at least one LPG365 device and one LPG365-P device.
- Verify Admin and User navigation and permissions separately.
- Verify that Leak Simulation creates a Critical alert and closes the selected device valve.
- Verify that an active leak prevents the valve from opening.
- Check relevant desktop and mobile layouts after UI changes.
- Report the files changed, checks run, results observed, and any unverified behavior.
