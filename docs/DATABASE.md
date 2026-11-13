# Silwasa Custom CMS & Website — Database Documentation

## 1. Database Overview

The application utilizes PostgreSQL managed through Prisma ORM. All primary keys use UUIDs for global uniqueness and secure URL references. Soft deletion and timestamps (`createdAt`, `updatedAt`) are implemented on key entities.

## 2. Entity Relational Model

```
       ┌───────────┐         ┌──────────────┐
       │   User    │◄───────┤   Session    │
       └─────┬─────┘         └──────────────┘
             │
             ├─────────────► ┌──────────────┐
             │               │   BlogPost   │◄──┐
             │               └──────┬───────┘   │
             │                      │           │
             │                      ├──► PostCategory ──► BlogCategory
             │                      │
             │                      └──► PostTag ──► BlogTag
             │
             ├─────────────► ┌──────────────┐
             │               │ PageRevision │
             │               └──────┬───────┘
             │                      ▼
             │               ┌──────────────┐
             │               │     Page     │◄──────┐
             │               └──────┬───────┘       │
             │                      ▼               │
             │               ┌──────────────┐       │
             ├──────────────►│ SEOMetadata  │───────┤
             │               └──────────────┘       │
             │                      ▲               │
             │                      │               │
             │               ┌──────┴───────┐       │
             │               │   Service    │       │
             │               └──────┬───────┘       │
             │                      ▼               │
             │               ┌──────────────┐       │
             │               │PricingPackage│       │
             │               └──────────────┘       │
             │                                      │
             │               ┌──────────────┐       │
             ├──────────────►│   Industry   │───────┤
             │               └──────────────┘       │
             │                                      │
             │               ┌──────────────┐       │
             ├──────────────►│PortfolioProj │───────┘
             │               └──────────────┘
             │
             ├─────────────► ┌──────────────┐
             │ (assigned)    │   Enquiry    │◄──── EnquiryNote
             │               └──────────────┘
             │
             └─────────────► ┌──────────────┐
                             │ ActivityLog  │
                             └──────────────┘
```

## 3. Data Integrity & Constraints

1. **Foreign Key Integrity:** Cascading deletes on relational junctions (`PostCategory`, `PostTag`, `PageRevision`, `EnquiryNote`).
2. **Safe Deletions:** Services and Users referenced in Pricing or Enquiries use `SetNull` to preserve financial and customer audit trails.
3. **Optimized Indexes:** Slugs, publication flags, and timestamps are indexed for sub-millisecond retrieval in high-traffic read paths.
4. **Monetary Precision:** Pricing fields use `Decimal(10, 2)` to eliminate floating-point calculation inaccuracies.
