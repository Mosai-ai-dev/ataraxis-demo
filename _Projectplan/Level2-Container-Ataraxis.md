# Level 2: Container Diagram

## System: Ataraxis AI Navigator Assistant

## Container Inventory

### Web Applications

| Container Name | Purpose | Responsibilities |
|---------------|---------|------------------|
| Navigator UI | Navigator interface with chat | - Chat function to interact with AI agent<br>- Execute everyday tasks using agent tools<br>- Collect information via agent<br>- Execute predefined workflows<br>- Team member notifications |
| Admin UI | Administration and audit | - Review past interactions<br>- Audit AI decisions<br>- Provide feedback for learning<br>- Pro HRIS authentication<br>- View metrics and reports |

### Services/APIs

| Container Name | Type | Responsibilities |
|---------------|------|------------------|
| API Gateway | Gateway | - Route requests<br>- Authentication<br>- Rate limiting<br>- Request validation |
| Core AI Service | Agentic Service | - Agentic framework for workflow execution<br>- Execute workflows from Level 1 context<br>- Access tools via Integration Service<br>- Learning and knowledge base improvement<br>- Decision making and routing |
| Integration Service | Tool Layer | - Standard communication to external tools<br>- MCP integration where possible<br>- Pro HRIS access<br>- Podium, Exchange, Teams tools<br>- Jira integration<br>- Data transformation |
| Workflow Engine | Service | - Stateful process manager for long-running workflows<br>- Event listeners for external triggers<br>- Handles asynchronous multi-step processes<br>- Manages workflows with back-and-forth interactions<br>- Coordinates time delays and waiting periods<br>- Tracks processes waiting on external systems/people<br>- Handles uncertain completion paths<br>- SLA timer management and escalations<br>- Maintains workflow state across sessions<br>- Reacts to system events (messages, timeouts, responses) |

### Data Stores

| Container Name | Type | Purpose |
|---------------|------|---------|
| Main Database | Database | Employee data cache, tickets, audit logs |
| Knowledge Base | Document Store | FAQ responses, patterns, templates |
| Message Queue | Queue | Async task processing |
| Cache Layer | Cache | Session data, temporary state |

### Background Workers

| Container Name | Purpose | Responsibilities |
|---------------|---------|------------------|
| Learning Engine | Continuous improvement | - Initialize KB from historical emails and Podium data<br>- Process feedback from Admin UI<br>- Update knowledge base<br>- Pattern recognition<br>- Model improvement<br>- Incorporate navigator corrections |
| SLA Monitor | Compliance tracking | - Monitor response times for email, text, Teams<br>- Track SLA compliance<br>- Trigger escalations via Workflow Engine<br>- Store SLA data for reporting |

## Container Interactions

| From Container | To Container | Purpose |
|---------------|--------------|---------|
| Navigator UI | API Gateway | Chat and workflow requests |
| Admin UI | API Gateway | Audit and feedback submissions |
| API Gateway | Core AI Service | Route requests to agent |
| Core AI Service | Integration Service | Execute tool actions |
| Core AI Service | Knowledge Base | Retrieve and update knowledge |
| Core AI Service | Workflow Engine | Complex workflow orchestration |
| Integration Service | Pro HRIS | Employee data access |
| Integration Service | Podium | Text messaging |
| Integration Service | Exchange | Email operations |
| Integration Service | Teams | Team communications |
| Integration Service | Jira | Ticket management |
| Workflow Engine | Message Queue | Async task processing |
| Learning Engine | Knowledge Base | Knowledge improvements |
| Learning Engine | Core AI Service | Model updates |
| SLA Monitor | Main Database | Compliance tracking |
| Admin UI | Learning Engine | Feedback for learning |


## Deployment Architecture

### Environments
| Environment | Purpose |
|------------|---------|
| Development | Development and testing |
| Staging | Pre-production validation |
| Production | Live system |

### Scaling Strategy
| Container | Min Instances | Max Instances | Scaling Trigger |
|-----------|---------------|---------------|-----------------|
| API Gateway | 2 | 10 | CPU > 70% |
| Core AI Service | 3 | 20 | Request queue depth |
| Integration Service | 2 | 10 | Request rate |
| Workflow Engine | 2 | 8 | Active workflows |
| SLA Monitor | 1 | 1 | Always running |
| Learning Engine | 1 | 3 | Feedback backlog |

## Security Considerations

### Authentication & Authorization
- [x] Single Sign-On integration
- [x] Multi-factor authentication for admin access
- [x] Role-based access control

### Network Security
- [x] Encrypted communication
- [x] API rate limiting
- [x] Network isolation
- [x] Secure secrets management

## Development Effort Estimation

### Container Development

| Container | Complexity | Estimated Hours | Team Size |
|-----------|-----------|-----------------|-----------|
| Navigator UI | High | 320 | 2 Frontend |
| Admin UI | Medium | 240 | 1 Frontend |
| API Gateway | Medium | 160 | 1 Backend |
| Core AI Service (Agentic) | Very High | 560 | 2 AI/Backend |
| Integration Service (MCP) | High | 400 | 2 Backend |
| Workflow Engine | High | 240 | 1 Backend |
| Learning Engine | Medium | 200 | 1 AI/Backend |
| SLA Monitor | Low | 80 | 1 Backend |

### Infrastructure Setup

| Task | Complexity | Estimated Hours |
|------|-----------|-----------------|
| Environment Setup | Medium | 80 |
| Container Orchestration | High | 120 |
| CI/CD Pipeline | Medium | 80 |
| Monitoring & Logging | Medium | 60 |
| Security Configuration | High | 100 |
| Load Testing | Medium | 60 |

## Visual Diagram

```mermaid
graph TB
    %% Styles
    classDef user fill:#08427b,stroke:#052e56,color:#fff
    classDef web fill:#1168bd,stroke:#0b4884,color:#fff
    classDef tools fill:#f77f00,stroke:#d66a00,color:#fff
    classDef agent fill:#e85d04,stroke:#c94a03,color:#fff
    classDef service fill:#438dd5,stroke:#3073b7,color:#fff
    classDef data fill:#669966,stroke:#486648,color:#fff
    classDef worker fill:#999999,stroke:#666666,color:#fff
    classDef external fill:#cccccc,stroke:#999999,color:#333
    classDef gateway fill:#7a4e9b,stroke:#5a3e7b,color:#fff

    classDef transparent fill:none,stroke:#333,stroke-width:2px,stroke-dasharray:5
    
    %% Define all external actors first to influence positioning
    NAV[Navigators]:::user
    ADMIN[Administrators]:::user
    
    %% Frontend Box
    subgraph FRONTEND["Webapp"]
        NAV_UI[Navigator UI<br/>━━━━━━━<br/>Chat Interface]:::web
        ADMIN_UI[Admin UI<br/>━━━━━━<br/>Audit & Feedback]:::web
    end
    
    %% External entities in their own subgraph for positioning
    subgraph EXTERNAL["Employee Interactions"]
        EMP[Employees]:::external
        TOOLS[External Tools<br/>━━━━━━━━<br/>Pro HRIS • Podium<br/>Exchange • Teams<br/>Jira]:::external
    end
    
    %% Backend Box
    subgraph BACKEND["Backend"]
        GW[API Gateway]:::gateway
        AI[Core AI Service<br/>━━━━━━━━━<br/>Agentic Framework<br/>Decision Making]:::agent
        INT[Integration Service<br/>━━━━━━━━━━<br/>Tool Layer / MCP]:::tools
        WF[Workflow Engine<br/>━━━━━━━━━<br/>Long-Running Processes<br/>Event Listeners<br/>State Management]:::service
        LEARN[Learning Engine]:::worker
        SLA[SLA Monitor]:::worker
    end
    
    %% Database Box
    subgraph DATABASE["Database"]
        DB[(Main Database)]:::data
        KB[(Knowledge Base)]:::data
        MQ[(Message Queue)]:::data
        CACHE[(Cache)]:::data
    end

    %% Apply transparent style to subgraphs
    class FRONTEND,BACKEND,DATABASE,EXTERNAL light
    
    %% User Connections
    NAV -->|Uses chat interface| NAV_UI
    ADMIN -->|Reviews & audits| ADMIN_UI
    
    %% Employee and External Tools connections (early to influence positioning)
    EMP -.->|Submits inquiries| TOOLS
    
    %% Web to Gateway
    NAV_UI -->|HTTPS/REST requests| GW
    ADMIN_UI -->|HTTPS/REST requests| GW
    
    %% Gateway to Services
    GW -->|Routes requests| AI
    GW -->|Caches sessions| CACHE
    
    %% Core AI Interactions
    AI <-->|Executes tools| INT
    AI <-->|Retrieves knowledge| KB
    AI <-->|Initiates/monitors workflows| WF
    AI -->|Stores decisions| DB
    
    %% Integration to Tools
    INT <-->|API/MCP calls| TOOLS
    
    %% Workflow & Workers
    WF <-->|Queues tasks / Listens for events| MQ
    WF <-->|Tracks SLA timers| SLA
    MQ -->|Triggers learning| LEARN
    
    %% Learning Loop
    ADMIN_UI -.->|Provides feedback| LEARN
    LEARN -->|Updates knowledge| KB
    LEARN -.->|Improves model| AI
    
    %% Data Connections
    WF -->|Persists workflow state| DB
    SLA -->|Records SLA metrics| DB
    WF <-->|Uses tools via| INT
```

## Notes for Development Team

### Agentic Framework Architecture

The Core AI Service implements an agentic framework that:
- Executes workflows defined in the Level 1 context diagram
- Uses tools through the Integration Service layer
- Makes autonomous decisions within defined boundaries
- Learns from interactions and feedback
- Maintains context across complex multi-step workflows

### Workflow Engine Purpose

The Workflow Engine handles processes that cannot be completed in a single sequential session:
- **Event-Driven Architecture**: Listens for and reacts to system events (new messages, timeouts, external responses)
- **Asynchronous Processes**: Workflows requiring back-and-forth interactions over time
- **Time-Delayed Operations**: Processes with scheduled waits, follow-ups, or SLA timers
- **External Dependencies**: Workflows waiting on other systems or human responses
- **Uncertain Paths**: Processes that may succeed, fail, retry, or escalate unpredictably
- Examples: Password reset flows, warm transfers, voicemail processing with SLA tracking
- Event triggers: Incoming messages, timer expirations, system responses, human actions

### Integration Service & MCP

The Integration Service acts as a tool layer providing:
- **Model Context Protocol (MCP)** implementation where possible for standardized tool access
- Unified interface for all external system interactions
- Tool definitions for: Pro HRIS, Podium, Exchange, Teams, Jira
- Data transformation and error handling
- Retry logic and circuit breakers


### Risk Mitigation

- Design Integration Service with plugin architecture for easy tool additions
- Implement guardrails in Core AI Service for agent decision boundaries
- Create fallback mechanisms for when tools are unavailable
- Maintain human-in-the-loop capabilities via Navigator UI
- Build robust audit trail for all agent actions and decisions
