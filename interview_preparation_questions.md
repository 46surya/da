## Data Modeling (OLTP / OLAP)
- How do you balance normalization and performance tuning when designing OLTP schemas for high-write workloads?
- What strategies do you use to model slowly changing dimensions, and when would you choose SCD Type 2 over Type 6?
- Explain how you would translate a canonical data model into subject-area specific marts without duplicating business logic.
- How do you enforce data contracts across microservices so their OLTP schemas remain compatible?
- Compare star, snowflake, and data vault schemas. Where does each shine or fall short?
- Describe your approach to schema evolution and versioning for both relational and analytical stores.
- How do you detect and remediate data anomalies (e.g., orphaned facts, referential breaks) across OLTP and OLAP systems?
- What techniques help minimize query latency on wide fact tables (e.g., clustering, partition elimination, materialized views)?
- How would you model semi-structured data (JSON, arrays) within an OLTP database without harming transactional guarantees?
- Outline a blueprint for governing master data across regions while keeping OLTP replicas eventually consistent.
____________________________________________________________________________Till here in doc

## Data Lakes / Lakehouses
- What criteria guide your decision to land data in bronze/silver/gold zones, and how do you enforce those contracts?
- How do you design governance so lake zones remain queryable yet compliant (encryption, masking, lineage)?
- Contrast Delta Lake, Apache Hudi, and Apache Iceberg. Which trade-offs matter most for your workloads?
- How do you orchestrate schema enforcement and evolution on raw object storage?
- Describe your approach to optimizing file sizes, compaction, and z-ordering to avoid small-file problems.
- How do you guarantee ACID semantics on top of an eventually consistent lake?
- Which metadata/catalog services do you prefer (Unity Catalog, AWS Glue, Apache Atlas) and why?
- How do you integrate ML feature stores or reverse ETL with a lakehouse?
- Discuss patterns for near-real-time ingestion into a lakehouse while keeping historical replays simple.
- How do you layer cost controls (tiered storage, lifecycle policies) without hurting analyst productivity?

## Distributed Data Systems & Big Data Architecture
- Walk through a reference architecture for a multi-region, low-latency analytical platform; where do you place each component?
- How do you decide between batch, micro-batch, and streaming for different SLAs?
- What partitioning and sharding strategies have you used to keep cluster hotspots under control?
- Explain mechanisms for achieving exactly-once processing semantics end to end.
- How do you monitor and test back-pressure handling and queue depth in distributed pipelines?
- Describe your resiliency plan for cross-zone or cross-cloud failover.
- How do you design data governance (catalog, lineage, quality rules) that works uniformly across heterogeneous engines?
- What KPIs and SLOs do you attach to ingestion, transformation, serving, and ML layers?
- How do you isolate noisy workloads in a shared compute platform (resource pools, QoS, auto-scaling)?
- Outline your approach to blue/green or canary deployments for large-scale data pipelines.

## Apache Spark
- How do you profile and optimize Spark jobs (e.g., AQE, broadcast joins, caching strategy)?
- Explain how Catalyst and Tungsten influence the optimizations you can perform manually.
- When do you choose RDDs vs DataFrames vs Datasets today?
- How do you design checkpointing and state management for structured streaming?
- Describe your approach to cluster sizing and auto-scaling for mixed batch/streaming workloads.
- What techniques do you use to debug skew, shuffle spill, or GC pressure?
- How do you enforce data quality expectations within Spark pipelines (Delta constraints, Deequ, Great Expectations)?
- Explain how you would unit test and CI/CD Spark code across Python, Scala, and SQL targets.
- How do you integrate Spark with external systems (Kafka, Kinesis, JDBC sinks) while preserving exactly-once guarantees?
- What is your strategy for managing libraries, dependencies, and UDF performance across teams?

## Apache Kafka
- How do you plan topic partitioning, retention, and compaction policies for different message classes?
- Describe how you enforce ordering and idempotency guarantees when consuming from multiple topics.
- What patterns do you use for schema management (Schema Registry, protobuf, Avro) and schema evolution?
- How do you secure Kafka end to end (authentication, encryption, ACLs, audit logging)?
- Explain how you detect consumer lag, rebalance storms, and slow brokers in production.
- How do you implement CDC-based ingestion into Kafka and keep downstream sinks consistent?
- What trade-offs do you consider between Kafka Streams, Flink, and Spark Structured Streaming?
- How do you govern data quality and lineage for events flowing through Kafka?
- Walk through your disaster recovery strategy for Kafka clusters across availability zones.
- How do you cost-optimize Kafka (tiered storage, compression, batching) without affecting SLAs?

## DBT (Data Build Tool)
- How do you structure DBT projects (domains, packages) for a large org with >1000 models?
- Describe your approach to model testing (generic tests, custom data tests, contracts).
- How do you manage macros, exposures, and documentation to keep lineage transparent?
- What deployment strategies do you use for DBT jobs (Slim CI, deferral, environment promotion)?
- How do you integrate DBT with data quality platforms, observability, or incident workflows?
- How do you optimize DBT runs to avoid warehouse contention (priority queues, concurrency, scheduling)?
- Explain how you manage secrets and credentials when running DBT in orchestrators (Airflow, Dagster, dbt Cloud).
- How do you enforce naming conventions and style guides across DBT repos?
- What is your approach to incremental models, snapshots, and backfills in DBT?
- How do you combine DBT semantic layer or metrics with downstream BI tools?

## Databricks
- Describe how you structure workspaces, repos, and catalogs for multi-tenant or multi-region environments.
- How do you leverage Unity Catalog for fine-grained governance and data sharing?
- What is your process for cluster policy design (instance profiles, pools, spot vs on-demand)?
- How do you integrate Databricks Jobs with orchestrators (Airflow, Azure Data Factory, Argo)?
- Explain your approach to monitoring costs and performance (cluster metrics, SQL warehouse utilization).
- How do you design CI/CD for notebooks, repos, and Delta Live Tables?
- What strategies do you use for MLflow tracking, feature store integration, and model serving?
- How do you secure Databricks (SCIM, SCIM groups, service principals, PAT rotation, VNET injection)?
- Describe how you would migrate legacy Spark workloads into Databricks while modernizing governance.
- How do you evaluate when to use Databricks SQL Warehouses vs interactive clusters vs serverless?

## Pipeline Tech Stack & Integrations
- Which orchestration patterns (Airflow, Dagster, Prefect, Azure Data Factory) fit which workloads, and why?
- How do you select ingestion tooling (Fivetran, StreamSets, Debezium, Kafka Connect) per source system?
- Describe your observability stack for data pipelines (OpenLineage, Monte Carlo, Datadog, Prometheus, custom SLIs).
- How do you design security across the stack (IAM, secrets, network zoning, tokenization)?
- What strategies ensure interoperability between Spark, Kafka, DBT, and Databricks components?
- How do you implement CI/CD across heterogeneous codebases (Scala, Python, SQL, Terraform)?
- What is your approach to data contract testing across pipeline stages and systems?
- How do you evaluate build-vs-buy decisions for catalogs, governance, or monitoring tools?
- Explain how you plan capacity and cost allocation for shared data platforms.
- How do you communicate architecture decisions and trade-offs to stakeholders (ADR templates, RFCs, architecture reviews)?


