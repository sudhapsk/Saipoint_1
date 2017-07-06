--
-- This script contains DDL statements to upgrade a database schema to
-- reflect changes to the model.  This file should only be used to
-- upgrade from the last formal release version to the current code base.
--

CONNECT TO iiq;

-- SCIM Audit Resources
ALTER TABLE identityiq.spt_audit_config ADD resources clob(17000000);
ALTER TABLE identityiq.spt_target ALTER COLUMN native_object_id SET DATA TYPE varchar(322);

-- Provisioning Transaction
create table identityiq.spt_provisioning_transaction (
    id varchar(32) not null,
    name varchar(255),
    created bigint,
    modified bigint,
    operation varchar(255),
    source varchar(255),
    application_name varchar(255),
    identity_name varchar(255),
    identity_display_name varchar(255),
    native_identity varchar(322),
    account_display_name varchar(322),
    attributes clob(17000000),
    integration varchar(255),
    certification_id varchar(32),
    forced smallint,
    type varchar(255),
    status varchar(255),
    native_identity_ci generated always as (upper(native_identity)),
    identity_name_ci generated always as (upper(identity_name)),
    account_display_name_ci generated always as (upper(account_display_name)),
    application_name_ci generated always as (upper(application_name)),
    integration_ci generated always as (upper(integration)),
    identity_display_name_ci generated always as (upper(identity_display_name)),
    primary key (id)
) IN identityiq_ts;

create index identityiq.spt_prvtrans_name on identityiq.spt_provisioning_transaction (name);

create index identityiq.spt_prvtrans_status on identityiq.spt_provisioning_transaction (status);

create index identityiq.spt_prvtrans_src on identityiq.spt_provisioning_transaction (source);

create index identityiq.spt_prvtrans_forced on identityiq.spt_provisioning_transaction (forced);

create index identityiq.spt_prvtrans_type on identityiq.spt_provisioning_transaction (type);

create index identityiq.spt_prvtrans_op on identityiq.spt_provisioning_transaction (operation);

create index identityiq.spt_prvtrans_iddn_ci on identityiq.spt_provisioning_transaction (identity_display_name_ci);

create index identityiq.spt_prvtrans_integ_ci on identityiq.spt_provisioning_transaction (integration_ci);

create index identityiq.spt_prvtrans_app_ci on identityiq.spt_provisioning_transaction (application_name_ci);

create index identityiq.spt_prvtrans_adn_ci on identityiq.spt_provisioning_transaction (account_display_name_ci);

create index identityiq.spt_prvtrans_idn_ci on identityiq.spt_provisioning_transaction (identity_name_ci);

create index identityiq.spt_prvtrans_nid_ci on identityiq.spt_provisioning_transaction (native_identity_ci);

create sequence identityiq.spt_prv_trans_sequence start with 1 increment by 1 nocache order;

-- End Provisioning Transaction

-- Indexed flag for schema attributes

alter table identityiq.spt_schema_attributes add column indexed smallint default 0 not null;

-- Indexed flag for schema permissions, child hierarchy

alter table identityiq.spt_application_schema add column index_permissions smallint default 0 not null;

alter table identityiq.spt_application_schema add column child_hierarchy smallint default 0 not null;

-- Extend TargetAssociation

alter table identityiq.spt_target_association add column application_name varchar(128);
alter table identityiq.spt_target_association add column target_type varchar(128);
alter table identityiq.spt_target_association add column target_name varchar(255);
alter table identityiq.spt_target_association add column hierarchy varchar(512);
alter table identityiq.spt_target_association add column flattened smallint default 0 not null;

-- Remove non null constraint from quickLinkOptions
alter table identityiq.spt_quick_link_options alter quick_link drop not null;
reorg table identityiq.spt_quick_link_options;

-- Extend ArchivedCertificationItem exceptionNativeIdentity column to match Link

alter table identityiq.spt_archived_cert_item alter column exception_native_identity set data type varchar(322);

-- Increase the field size for spt_certification_archive.name
ALTER TABLE identityiq.spt_certification_archive ALTER COLUMN name SET DATA TYPE varchar(256);

create index identityiq.spt_application_modified on identityiq.spt_application (modified);
create index identityiq.spt_application_created on identityiq.spt_application (created);

create index identityiq.spt_integration_conf_created on identityiq.spt_integration_config (created);
create index identityiq.spt_integration_conf_modified on identityiq.spt_integration_config (modified);

CREATE INDEX identityiq.spt_target_native_obj_id ON identityiq.spt_target (native_object_id);
CREATE INDEX identityiq.spt_target_last_agg ON identityiq.spt_target (last_aggregation);

ALTER TABLE identityiq.spt_target_association ADD last_aggregation bigint;

CREATE INDEX identityiq.spt_target_assoc_last_agg ON identityiq.spt_target_association (last_aggregation);

-- Add refreshRule to TargetSource
ALTER TABLE identityiq.spt_target_source ADD refresh_rule varchar(32);

-- Add extended1 to Target
set integrity for identityiq.spt_target off;
alter table identityiq.spt_target add extended1 varchar(255);
alter table identityiq.spt_target add extended1_ci generated always as (upper(extended1));

SET INTEGRITY FOR IDENTITYIQ.SPT_TARGET,IDENTITYIQ.SPT_TARGET_ASSOCIATION
IMMEDIATE CHECKED FORCE GENERATED;


create index identityiq.spt_target_extended1_ci on identityiq.spt_target (extended1_ci);

-- aggregation types

alter table identityiq.spt_application add column aggregation_types varchar(128);
alter table identityiq.spt_application_schema add column aggregation_type varchar(128);

-- Increase the field size for spt_service_definition.hosts
ALTER TABLE identityiq.spt_service_definition ALTER COLUMN hosts SET DATA TYPE varchar(1024);

-- Plugin

create table identityiq.spt_plugin (
    id varchar(32) not null,
    name varchar(255),
    created bigint,
    modified bigint,
    install_date bigint,
    display_name varchar(255),
    version varchar(255),
    disabled smallint,
    right_required varchar(255),
    min_system_version varchar(255),
    max_system_version varchar(255),
    attributes clob(17000000),
    position integer,
    certification_level varchar(255),
    file_id varchar(32),
    display_name_ci generated always as (upper(display_name)),
    name_ci generated always as (upper(name)),
    primary key (id)
) IN identityiq_ts;

alter table identityiq.spt_plugin 
    add constraint FK13AE22BBF7C36E0D 
    foreign key (file_id) 
    references identityiq.spt_persisted_file;

create index identityiq.FK13AE22BBF7C36E0D on identityiq.spt_plugin (file_id);

create index identityiq.spt_plugin_name_ci on identityiq.spt_plugin (name_ci);

create index identityiq.spt_plugin_dn_ci on identityiq.spt_plugin (display_name_ci);

-- End Plugin

-- ActivityAlerts
create table identityiq.spt_alert (
        id varchar(32) not null,
        created bigint,
        modified bigint,
        extended1 varchar(255),
        attributes clob(17000000),
        source varchar(32),
        alert_date bigint,
        native_id varchar(255),
        target_id varchar(255),
        target_type varchar(255),
        target_display_name varchar(255),
        last_processed bigint,
        display_name varchar(128),
        name varchar(255),
        type varchar(255),
        extended1_ci generated always as (upper(extended1)),
        primary key (id)
    ) IN identityiq_ts;

create table identityiq.spt_alert_action (
        id varchar(32) not null,
        created bigint,
        modified bigint,
        alert_def clob(17000000),
        action_type varchar(255),
        result_id varchar(255),
        result clob(17000000),
        alert varchar(32),
        primary key (id)
    ) IN identityiq_ts;

create table identityiq.spt_alert_definition (
        id varchar(32) not null,
        created bigint,
        modified bigint,
        owner varchar(32),
        assigned_scope varchar(32),
        assigned_scope_path varchar(450),
        match_config clob(17000000),
        disabled smallint,
        name varchar(128) not null unique,
        description varchar(1024),
        display_name varchar(128),
        action_config clob(17000000),
        name_ci generated always as (upper(name)),
        primary key (id)
    ) IN identityiq_ts;

create index identityiq.spt_alert_last_processed on identityiq.spt_alert (last_processed);

create index identityiq.spt_alert_name on identityiq.spt_alert (name);

alter table identityiq.spt_alert
        add constraint FKAD3A44D4A7C3772B
        foreign key (source)
        references identityiq.spt_application;

create index identityiq.FKAD3A44D4A7C3772B on identityiq.spt_alert (source);

alter table identityiq.spt_alert_action
        add constraint FK89E001BF1C6C78
        foreign key (alert)
        references identityiq.spt_alert;

create index identityiq.FK89E001BF1C6C78 on identityiq.spt_alert_action (alert);

alter table identityiq.spt_alert_definition
        add constraint FK3DF7B99EA5FB1B1
        foreign key (owner)
        references identityiq.spt_identity;

create index identityiq.FK3DF7B99EA5FB1B1 on identityiq.spt_alert_definition (owner);

alter table identityiq.spt_alert_definition
        add constraint FK3DF7B99E486634B7
        foreign key (assigned_scope)
        references identityiq.spt_scope;

create index identityiq.FK3DF7B99E486634B7 on identityiq.spt_alert_definition (assigned_scope);

create index identityiq.SPT_IDX99763E0AD76DF7A8 on identityiq.spt_alert_definition (assigned_scope_path);

 create index identityiq.spt_alert_definition_name on identityiq.spt_alert_definition (name_ci);

create sequence identityiq.spt_alert_sequence start with 1 increment by 1 nocache order;

ALTER TABLE identityiq.spt_application_schema ADD creation_rule varchar(32);

alter table identityiq.spt_application_schema
        add constraint FK62F93AF84FE65998
        foreign key (creation_rule)
        references identityiq.spt_rule;

create index identityiq.FK62F93AF84FE65998 on identityiq.spt_application_schema (creation_rule);

ALTER TABLE identityiq.spt_application_schema ADD customization_rule varchar(32);

alter table identityiq.spt_application_schema
        add constraint FK62F93AF86FB29924
        foreign key (customization_rule)
        references identityiq.spt_rule;

create index identityiq.FK62F93AF86FB29924 on identityiq.spt_application_schema (customization_rule);

ALTER TABLE identityiq.spt_application_schema ADD correlation_rule varchar(32);

alter table identityiq.spt_application_schema
        add constraint FK62F93AF8BE1EE0D5
        foreign key (correlation_rule)
        references identityiq.spt_rule;

create index identityiq.FK62F93AF8BE1EE0D5 on identityiq.spt_application_schema (correlation_rule);

-- End Activity Alerts

-- Update field sizes to accommodate managed attribute values
ALTER TABLE identityiq.spt_certification_entity ALTER COLUMN identity_id SET DATA TYPE varchar(450);
ALTER TABLE identityiq.spt_certification_entity ALTER COLUMN account_group SET DATA TYPE varchar(450);
ALTER TABLE identityiq.spt_audit_event ALTER COLUMN string1 SET DATA TYPE varchar(450); 
ALTER TABLE identityiq.spt_audit_event ALTER COLUMN string2 SET DATA TYPE varchar(450); 
ALTER TABLE identityiq.spt_audit_event ALTER COLUMN string3 SET DATA TYPE varchar(450); 
ALTER TABLE identityiq.spt_audit_event ALTER COLUMN string4 SET DATA TYPE varchar(450); 
SET INTEGRITY FOR identityiq.spt_archived_cert_entity OFF;
DROP INDEX identityiq.spt_arch_entity_identity_csi;
DROP INDEX identityiq.spt_arch_entity_acct_grp_csi;
SET INTEGRITY FOR identityiq.spt_archived_cert_entity IMMEDIATE CHECKED;
ALTER TABLE identityiq.spt_archived_cert_entity DROP COLUMN identity_name_ci;
ALTER TABLE identityiq.spt_archived_cert_entity DROP COLUMN account_group_ci;
REORG TABLE identityiq.spt_archived_cert_entity;
ALTER TABLE identityiq.spt_archived_cert_entity ALTER COLUMN identity_name SET DATA TYPE varchar(450);
ALTER TABLE identityiq.spt_archived_cert_entity ALTER COLUMN account_group SET DATA TYPE varchar(450);
SET INTEGRITY FOR identityiq.spt_archived_cert_entity OFF;
ALTER TABLE identityiq.spt_archived_cert_entity ADD COLUMN identity_name_ci GENERATED ALWAYS as (upper(identity_name));
ALTER TABLE identityiq.spt_archived_cert_entity ADD COLUMN account_group_ci GENERATED ALWAYS as (upper(account_group));
SET INTEGRITY FOR identityiq.spt_arch_cert_item_apps,identityiq.spt_archived_cert_entity,identityiq.spt_archived_cert_item IMMEDIATE CHECKED FORCE GENERATED;
CREATE INDEX identityiq.spt_arch_entity_identity_csi on identityiq.spt_archived_cert_entity (identity_name_ci);
CREATE INDEX identityiq.spt_arch_entity_acct_grp_csi on identityiq.spt_archived_cert_entity (account_group_ci);
SET INTEGRITY FOR identityiq.spt_entitlement_snapshot,identityiq.spt_certification_item OFF;
DROP INDEX identityiq.spt_ent_snap_displayName_ci;
SET INTEGRITY FOR identityiq.spt_entitlement_snapshot,identityiq.spt_certification_item IMMEDIATE CHECKED;
ALTER TABLE identityiq.spt_entitlement_snapshot DROP COLUMN display_name_ci;
REORG TABLE identityiq.spt_entitlement_snapshot;
ALTER TABLE identityiq.spt_entitlement_snapshot ALTER COLUMN display_name SET DATA TYPE varchar(450);
SET INTEGRITY FOR identityiq.spt_entitlement_snapshot,identityiq.spt_certification_item OFF;
ALTER TABLE identityiq.spt_entitlement_snapshot ADD COLUMN display_name_ci GENERATED ALWAYS as (upper(display_name));
SET INTEGRITY FOR identityiq.spt_entitlement_snapshot,identityiq.spt_certification_item IMMEDIATE CHECKED FORCE GENERATED;
CREATE INDEX identityiq.spt_ent_snap_displayName_ci on identityiq.spt_entitlement_snapshot (display_name_ci);
-- End update field sizes to accommodate managed attribute values

create index identityiq.spt_syslog_created on identityiq.spt_syslog_event (created);

-- Make CertificationEntity indexes case insensitive
drop index identityiq.spt_certification_entity_tdn;
drop index identityiq.spt_cert_entity_firstname;
drop index identityiq.spt_cert_entity_lastname;

SET INTEGRITY FOR identityiq.spt_certification_entity OFF;
alter table identityiq.spt_certification_entity add target_display_name_ci generated always as (upper(target_display_name));
alter table identityiq.spt_certification_entity add firstname_ci generated always as (upper(firstname));
alter table identityiq.spt_certification_entity add lastname_ci generated always as (upper(lastname));
SET INTEGRITY FOR IDENTITYIQ.SPT_CERT_ITEM_APPLICATIONS,IDENTITYIQ.SPT_CERTIFICATION_ENTITY,IDENTITYIQ.SPT_CERTIFICATION_ITEM,IDENTITYIQ.SPT_ENTITLEMENT_SNAPSHOT,IDENTITYIQ.SPT_IDENTITY_ENTITLEMENT,IDENTITYIQ.SPT_SNAPSHOT_PERMISSIONS IMMEDIATE CHECKED FORCE GENERATED;

create index identityiq.spt_cert_entity_tdn_ci on identityiq.spt_certification_entity (target_display_name_ci);
create index identityiq.spt_cert_entity_firstname_ci on identityiq.spt_certification_entity (firstname_ci);
create index identityiq.spt_cert_entity_lastname_ci on identityiq.spt_certification_entity (lastname_ci);
-- End Cert Entity updates

--
-- make sure to change the schema version here. LEAVE THIS HERE
--
update identityiq.spt_database_version set schema_version = '7.1-29' where name = 'main';
