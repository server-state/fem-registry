create table maintainer
(
    id       INTEGER not null,
    name     TEXT    not null,
    password TEXT    not null,
    email    TEXT    not null,
    constraint maintainer_pk
        primary key (id autoincrement)
);

create unique index maintainer_email_uindex
    on maintainer (email);

create table publisher
(
    id       INTEGER,
    name     TEXT not null,
    password TEXT not null,
    email    TEXT not null,
    constraint developer_pk
        primary key (id autoincrement)
);

create table cbm
(
    id           INTEGER not null,
    name         TEXT    not null,
    publisher_id INTEGER,
    primary key (id autoincrement),
    foreign key (publisher_id) references publisher
        on update cascade on delete cascade
);

create unique index developer_email_uindex
    on publisher (email);

create table "release"
(
    id            INTEGER not null,
    cbm_id     INTEGER not null,
    name          TEXT    not null,
    version       TEXT    not null,
    code          TEXT    not null,
    description   TEXT    default '',
    release_notes TEXT    default '',
    support_url  TEXT    not null,
    website      TEXT,
    repo_url     TEXT,
    status         INTEGER not null DEFAULT 0,
    status_by   INTEGER default NULL,
    status_at   INTEGER    default NULL,
    constraint release_pk
        primary key (id autoincrement),
    foreign key (status_by) references maintainer
        on update cascade,
    foreign key (cbm_id) references cbm
        on update cascade on delete cascade
);

create table image
(
    id         INTEGER not null,
    alt        TEXT,
    data       BLOB    not null,
    release_id INTEGER not null,
    mime_type  TEXT    not null,
    constraint image_pk
        primary key (id autoincrement),
    foreign key (release_id) references "release"
        on update cascade on delete cascade
);


