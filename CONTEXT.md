# Repository Context

This context defines both the documentation language and the product-domain language used in this repository.

## Language

### Documentation Language

**Source of Truth**:
The canonical document variant that must be updated first when a decision changes.
_Avoid_: Main copy, reference copy

**Active Plan**:
A plan that is currently being executed and must match the repository's present state.
_Avoid_: Draft, backlog item, historical note

**Completed Plan**:
A finished plan kept as a historical record and no longer updated except for final status and successor links.
_Avoid_: Current plan, live plan

**Superseded Plan**:
A historical plan that has been replaced by a newer plan and should point readers to its successor.
_Avoid_: Active plan, latest plan

**Feature Spec**:
A feature-level design document that defines intended behaviour and constraints more durably than an execution plan.
_Avoid_: Task list, implementation log

**Human-First Docs**:
Documentation in the root `docs/` space that is organised primarily for human readers rather than agent execution.
_Avoid_: Agent script, machine-only notes

**Document Category**:
A stable top-level documentation grouping based on the document's purpose, such as product, architecture, specs, plans, or agent material.
_Avoid_: Temporary bucket, status bucket

**Stable Filename**:
A document name that reflects its enduring topic rather than its position in a numbered reading sequence.
_Avoid_: Ordered filename, sequence number

**Agent Configuration**:
Machine-readable or policy-style documentation that agent skills consult to decide how to behave in this repository.
_Avoid_: Playbook, tutorial

**Playbook**:
Human-readable operational guidance that explains how to perform repeatable workflows with the project's tools and skills.
_Avoid_: Configuration, source of truth

**Legacy Tooling Label**:
A historical naming artifact derived from a specific tool or workflow that should not define the long-term information architecture.
_Avoid_: Canonical category, domain term

**Documentation Map**:
The primary entry document that explains the documentation structure, reading order, and trust rules for human readers.
_Avoid_: Random index, folder dump

**Documentation Metadata**:
A small, standard set of fields at the top of a document that tells readers how to trust, translate, maintain, and replace it.
_Avoid_: Ad-hoc notes, inconsistent header

**Document Status**:
The lifecycle state of a document, such as active, completed, or superseded.
_Avoid_: Implicit state, guessed state

**Audience**:
The primary reader a document is written for, such as human readers or agent skills.
_Avoid_: Everyone, unspecified reader

**Language Role**:
Whether a document is the source-of-truth variant or a translation.
_Avoid_: Primary language, secondary copy

**Frontmatter**:
A structured metadata block at the top of a Markdown document used to make trust and lifecycle fields explicit and machine-readable.
_Avoid_: Freeform header, inline note

**Core Schema**:
The shared set of frontmatter fields that every important document must carry regardless of category.
_Avoid_: Per-file improvisation, optional-by-default schema

**Extension Field**:
An additional frontmatter field used only by specific document categories when the extra meaning is necessary.
_Avoid_: Universal field, mandatory-for-all field

**Core Metadata Fields**:
The mandatory frontmatter fields required on every important document: `title`, `status`, `audience`, `language`, `language_role`, `owner`, and `last_updated`.
_Avoid_: Optional baseline, drifting baseline

**Owner Role**:
The responsible role named in document metadata, such as `FE Lead` or `BA Lead`, rather than a specific person's name.
_Avoid_: Individual name, temporary assignee

**Status Vocabulary**:
The allowed document status values in metadata: `active`, `completed`, and `superseded`.
_Avoid_: Done, obsolete, archived, current

**Audience Vocabulary**:
The allowed audience values in metadata: `human`, `agent`, and `mixed`.
_Avoid_: People, internal, everyone, human-first

**Language Role Vocabulary**:
The allowed language role values in metadata: `source-of-truth` and `translation`.
_Avoid_: Primary, localized-copy, reference

**Language Vocabulary**:
The allowed language values in metadata: `vi` and `en`.
_Avoid_: vn, vi-VN, en-US, english, vietnamese

**Product Roadmap**:
A product-level document that describes phased direction, milestones, and intended business progression rather than day-to-day execution steps.
_Avoid_: Task checklist, sprint plan

**Priority Backlog**:
An execution-focused document that orders implementation work by priority, dependency, and readiness.
_Avoid_: Product strategy, long-term vision

**Technical Baseline**:
An architecture document that records the approved technical stack, version policy, and engineering quality gates for the repository.
_Avoid_: Product scope, feature backlog

**Implementation Convention**:
An architecture document that defines project structure, boundaries, design-system rules, and coding conventions for implementation consistency.
_Avoid_: Feature spec, product roadmap

**MVP Overview**:
A product document that defines the MVP's purpose, scope, user journeys, success criteria, and business boundaries.
_Avoid_: Technical baseline, execution checklist

**Playbook Guide**:
An operational guide that teaches humans how to run repeatable workflows with the repository's tools, skills, or processes.
_Avoid_: Product requirement, architecture baseline

**Skill Inventory**:
A playbook-style reference that catalogs available skills, their fit, and their recommended usage in the project.
_Avoid_: Product roadmap, feature plan

**Experience Upgrade Spec**:
A feature-level specification that defines the intended UX, visual, and interaction improvements for a premium experience upgrade.
_Avoid_: General roadmap, workflow guide

**Phased Migration**:
A multi-step documentation restructuring approach that introduces the new information architecture incrementally instead of moving everything in one operation.
_Avoid_: Big-bang rewrite, one-shot move

**Temporary Stub**:
A short transitional document kept at an old path that points readers to the new canonical location until the migration is fully complete.
_Avoid_: Permanent duplicate, full copy

**Dated Plan Filename**:
A plan filename that keeps a calendar date prefix to preserve temporal ordering and distinguish successive execution plans on similar topics.
_Avoid_: Undated plan name, sequence number

**Stable Spec Filename**:
A spec filename that stays tied to the feature topic rather than to the day it was written.
_Avoid_: Dated spec name, sequence number

**Selective Translation Policy**:
A documentation policy where only chosen document categories or high-value documents require an English translation, while Vietnamese remains the canonical source language.
_Avoid_: Translate everything, translation-by-default

**Translation Coverage Rule**:
The rule that `README`, `product`, and `architecture` documents should normally provide English translations, while `specs`, `plans`, `agents`, and `playbooks` are translated only when needed.
_Avoid_: Universal bilingual requirement, undocumented exception

**Repository ADR Log**:
The top-level repository decision log stored in `docs/adr/`, used for durable cross-cutting decisions that may extend beyond technical architecture.
_Avoid_: Nested ADR silo, feature-local note

**ADR Format**:
The required structure for any Architecture Decision Record in this repository: a YAML frontmatter block with at minimum `title`, `status`, `date`, and `supersedes` fields, followed by four body sections — **Context** (why the decision was needed), **Decision** (what was decided), **Consequences** (what changes as a result), and **Alternatives Considered** (what else was evaluated and why it was not chosen).
_Avoid_: Single-paragraph summary, prose-only body, section-free ADR

**Combined Context**:
A root `CONTEXT.md` structure that contains both documentation-language terms and product-domain terms in clearly separated sections.
_Avoid_: Documentation-only glossary, mixed untitled glossary

### Product Domain Language

**Customer**:
The person who owns a cart, places an order, and later views order history or order details.
_Avoid_: Shopper, buyer, account

**Shopper Persona**:
The browsing-oriented persona used in UX discussion for discovery, comparison, and purchase behaviour before or around ordering.
_Avoid_: Customer record, account owner, canonical domain actor

**User**:
The authenticated identity used for login, session, and access control concerns in the system.
_Avoid_: Customer, shopper persona

**Authenticated Checkout**:
The rule that Checkout can only proceed when a User is signed in, even if browsing and cart-building began anonymously.
_Avoid_: Guest checkout, anonymous order submission

**Cart Continuity**:
The rule that a Cart built before login should remain available after the User signs in so the customer can continue toward Checkout without losing intent.
_Avoid_: Cart reset on login, forced restart

**Cart Merge**:
The rule that an anonymous Cart and an existing signed-in Cart are combined after login rather than one silently replacing the other.
_Avoid_: Cart overwrite, cart discard

**Quantity Revalidation**:
The check that recomputes whether merged or updated cart quantities remain valid against Variant Stock before Checkout can continue.
_Avoid_: Blind quantity carry-over, unchecked merge

**Quantity Clamp**:
The rule that reduces a requested cart quantity down to the maximum quantity allowed by Variant Stock instead of keeping an invalid amount.
_Avoid_: Invalid quantity retention, hard cart failure

**Stock Adjustment Notice**:
The explicit customer-facing message that explains when cart quantities were reduced to match current Variant Stock.
_Avoid_: Silent correction, hidden stock change

**Out of Stock**:
The inventory condition where a Product Variant cannot be newly added to the Cart and cannot proceed through Checkout until stock becomes available again.
_Avoid_: Soft warning only, still-purchasable state

**Low Stock**:
A derived selling-state signal that indicates scarcity for a Product Variant without making it non-purchasable.
_Avoid_: Out of stock, primary inventory state

**Catalog**:
The sellable collection of Products, Product Variants, and Category structure that the business presents for discovery and purchase.
_Avoid_: Storefront UI, marketing shell

**Storefront**:
The customer-facing experience surface through which the Catalog is browsed, searched, and purchased.
_Avoid_: Catalog itself, backoffice

**Home**:
The primary entry surface of the Storefront that combines merchandising and discovery entry points for the Customer.
_Avoid_: Standalone marketing microsite, separate domain

**Featured Products**:
A merchandising-selected set of Products highlighted in the Storefront to steer customer attention and discovery.
_Avoid_: Category, automatic best-seller synonym

**Best Sellers**:
A sales-performance-derived set of Products identified by strong selling results rather than by manual merchandising alone.
_Avoid_: Featured products, arbitrary editorial label

**New Arrivals**:
A recency-derived set of Products that have entered the Catalog recently enough to be presented as newly available.
_Avoid_: Featured products, generic badge

**Flash Sale**:
A timeboxed promotional campaign or collection that creates urgency around discounted products for a limited period.
_Avoid_: Generic sale badge, permanent discount label

**List Price**:
The reference price of a Product or Product Variant used to show the non-discounted baseline before any active promotion is applied.
_Avoid_: Effective checkout price, decorative-only number

**Sale Price**:
The effective purchase price a Customer pays when a qualifying promotion is active for the Product or Product Variant.
_Avoid_: Decorative discount label, non-binding display value

**Order Total**:
The committed total amount stored on an Order at creation time, representing what the Customer agreed to pay for that purchase.
_Avoid_: Recomputed catalog total, live pricing estimate

**Order Line Unit Price**:
The committed per-unit purchase price stored on an Order Line at the moment the Order is created.
_Avoid_: Live catalog price, decorative display value

**Cart Pricing**:
The dynamic and revalidated pricing shown in the Cart before checkout succeeds, reflecting the currently effective purchasable price.
_Avoid_: Committed order price, immutable snapshot

**Order Pricing**:
The committed pricing captured on the Order and its Order Lines once checkout succeeds.
_Avoid_: Live cart recalculation, mutable catalog pricing

**Price Revalidation**:
The rule that Cart Pricing must be recomputed against the currently effective purchasable price before checkout can complete.
_Avoid_: Stale cart pricing, frozen pre-order price

**Price Change Notice**:
The explicit customer-facing message that explains when Cart Pricing changed because the current effective price differs from an earlier cart view.
_Avoid_: Silent repricing, hidden change

**Revalidated Checkout State**:
The refreshed checkout/cart state that reflects the latest valid pricing and stock constraints before an Order can be created.
_Avoid_: Stale pre-submit state, hidden recalculation

**Submit Revalidation Gate**:
The final pre-order rule that rejects the current checkout submission when stock or pricing changes are detected at submit time, then refreshes the customer into a Revalidated Checkout State.
_Avoid_: Silent submit mutation, auto-commit on changed terms

**Post-Order Cart Clear**:
The rule that removes Cart Lines from the Cart once they have been successfully committed into an Order.
_Avoid_: Duplicate retained cart, ambiguous post-purchase cart state

**Checkout Completion Point**:
The rule that the Checkout flow is considered complete when the Customer reaches Order Confirmation after a successful order creation.
_Avoid_: Implicit success only, missing flow terminus

**Post-Confirmation Primary CTA**:
The main action from Order Confirmation that takes the Customer to the specific Order Detail for the Order just created.
_Avoid_: Generic order list redirect, ambiguous next step

**Cart**:
The pre-order collection of items a Customer is considering buying, including quantity changes and interim totals before order submission.
_Avoid_: Checkout, order, basket flow

**Checkout**:
The order-submission flow where a Customer provides fulfillment details, reviews charges, and confirms the purchase.
_Avoid_: Cart, order history, payment record

**Order**:
The committed purchase record created only after a Customer submits Checkout successfully.
_Avoid_: Cart, draft checkout, pre-submit state

**Order Confirmation**:
The post-submit screen or artifact that confirms an Order was created successfully and gives the Customer immediate visibility into the result.
_Avoid_: Order status, fulfillment state

**Store Operator**:
The day-to-day backoffice actor who manages products and processes Orders as part of store operations.
_Avoid_: Generic admin, system owner

**Admin**:
The higher-privilege system or owner-level role used when discussing cross-cutting control beyond routine store operations.
_Avoid_: Store operator, default backoffice actor

**Product**:
The sellable catalog entity a Customer discovers and views before choosing a specific purchase option.
_Avoid_: Variant, cart line, SKU choice

**Product Variant**:
The specific purchasable option of a Product that a Customer selects, such as a size-based choice with its own availability.
_Avoid_: Generic product, UI-only option

**Variant Stock**:
The availability quantity or stock status attached to a specific Product Variant rather than to the abstract Product as a whole.
_Avoid_: Product-level stock, generic inventory flag

**Category**:
The canonical catalog taxonomy used to group Products for navigation, discovery, and listing flows.
_Avoid_: Marketing badge, temporary label

**Promotional Badge**:
A marketing or selling-state label such as `new`, `sale`, `best-seller`, or `low-stock` that can be attached to a Product without changing its catalog taxonomy.
_Avoid_: Category, primary taxonomy

**Cart Line**:
The pre-order line item inside a Cart that records a chosen Product Variant, quantity, and interim pricing context before checkout submission.
_Avoid_: Order line, generic product

**Order Line**:
The committed line item inside an Order that records what was purchased after checkout submission succeeds.
_Avoid_: Cart line, PDP item

**Payment Method**:
The domain concept that describes how a Customer is expected to pay for an Order.
_Avoid_: Temporary workaround, implementation toggle

**Cash on Delivery (COD)**:
The MVP Payment Method where payment is collected when the Order is delivered.
_Avoid_: Hack, fallback-only path

**Fulfillment Details**:
The set of customer-provided delivery information needed to complete checkout and route the Order for fulfillment.
_Avoid_: Shipping address only, contact field bundle

**Order Status**:
The business-state concept used to describe where an Order is in its operational lifecycle, without yet fixing the exact allowed status values.
_Avoid_: Confirmation screen, UI badge only

**Order History**:
The list of Orders that have already been created for a Customer after successful checkout submission.
_Avoid_: Cart history, abandoned checkout list

**Order Detail**:
The detailed view or representation of a single created Order shown to a Customer or backoffice actor.
_Avoid_: Draft order, separate business entity

**Customer Account**:
The post-login customer space that contains account-related capabilities such as profile information, order history, and future account management features.
_Avoid_: Profile only, generic auth state

**Profile**:
The subsection of a Customer Account that focuses on the customer's personal information rather than the whole account space.
_Avoid_: Customer account, full self-service area

**Address Book**:
The reusable set of saved addresses stored in a Customer Account for future checkout convenience.
_Avoid_: Fulfillment details, order snapshot

**Fulfillment Snapshot**:
The copy of Fulfillment Details stored on an Order at the moment checkout succeeds, preserving what was committed at purchase time.
_Avoid_: Live address book reference, mutable delivery profile

**Search**:
The intentional product-discovery behavior where a Customer looks for Products using a query or explicit purchase intent.
_Avoid_: Category browsing, generic navigation

**Category Discovery**:
The taxonomy-led product-discovery behavior where a Customer explores Products by moving through Category-based navigation.
_Avoid_: Search query, direct lookup

**Filter**:
The shared refinement mechanism that narrows visible Products within discovery flows such as Search and Category Discovery.
_Avoid_: Search itself, category taxonomy

**Sort**:
The ordering mechanism that rearranges already visible discovery results without changing which Products are included.
_Avoid_: Filter, category taxonomy

## Relationships

- An **Active Plan** may implement one or more **Feature Specs**
- A **Completed Plan** or **Superseded Plan** is not a **Source of Truth**
- A **Source of Truth** can exist in Vietnamese while an English document acts as its translation
- **Human-First Docs** may reference **Feature Specs** and **Active Plans**, but they serve different audiences
- A **Document Category** groups documents by purpose, not by how final they feel today
- A **Stable Filename** remains valid even when new documents are inserted before or after it
- An **Agent Configuration** document tells skills how to operate, while a **Playbook** tells humans how to run a workflow
- A **Legacy Tooling Label** may be recorded as origin metadata, but it should not become a permanent document category
- A **Documentation Map** points readers to the correct **Document Category** and explains which files are the **Source of Truth**
- **Documentation Metadata** makes a document's **Document Status**, **Audience**, and **Language Role** explicit
- A document with **Language Role** `translation` should point to the canonical Vietnamese source file
- **Frontmatter** is the standard format for **Documentation Metadata** in this repository
- A **Core Schema** keeps metadata consistent across categories, while an **Extension Field** captures category-specific meaning
- **Core Metadata Fields** define the minimum trust contract for any important document in this repository
- The `owner` field in **Core Metadata Fields** must use an **Owner Role** rather than a person-specific name
- The `status` field in **Core Metadata Fields** must use the **Status Vocabulary** `active`, `completed`, or `superseded`
- The `audience` field in **Core Metadata Fields** must use the **Audience Vocabulary** `human`, `agent`, or `mixed`
- The `language_role` field in **Core Metadata Fields** must use the **Language Role Vocabulary** `source-of-truth` or `translation`
- The `language` field in **Core Metadata Fields** must use the **Language Vocabulary** `vi` or `en`
- A **Product Roadmap** belongs to the product documentation layer, while a **Priority Backlog** belongs to the plans documentation layer
- A **Technical Baseline** and an **Implementation Convention** both belong to the architecture documentation layer
- An **MVP Overview** belongs to the product documentation layer
- A **Playbook Guide** and a **Skill Inventory** both belong to the playbooks documentation layer
- An **Experience Upgrade Spec** belongs to the specs documentation layer
- A documentation restructure should use **Phased Migration** when link stability and gradual cleanup matter more than immediate reorganisation
- A **Temporary Stub** can preserve link continuity during **Phased Migration**, but it should be removed once the migration is complete
- A **Dated Plan Filename** is appropriate for plans, while a **Stable Spec Filename** is appropriate for living feature specs
- A **Selective Translation Policy** reduces maintenance overhead by requiring English only where cross-language sharing genuinely matters
- The **Translation Coverage Rule** defines which document categories normally require English and which categories default to Vietnamese-only
- A **Repository ADR Log** lives at `docs/adr/` because repository decisions can span documentation, process, and architecture
- A **Combined Context** keeps one root glossary for both documentation and product language, provided the sections remain clearly separated
- A **Customer** may act through the **Shopper Persona** during browsing flows, but the canonical domain actor remains **Customer**
- A **User** provides authenticated identity, while a **Customer** expresses the commerce actor in shopping and ordering flows
- A **Cart** may lead into **Checkout**, but **Checkout** is not itself the **Cart**
- **Authenticated Checkout** requires a signed-in **User** before **Checkout** can create an **Order**
- **Cart Continuity** preserves an anonymous **Cart** across login so it can continue into **Authenticated Checkout**
- **Cart Merge** combines anonymous and signed-in cart contents after login
- When the same **Product Variant** appears in both carts, **Cart Merge** adds quantities and then applies **Quantity Revalidation** against **Variant Stock**
- **Quantity Revalidation** may trigger **Quantity Clamp**, and any clamp should surface a **Stock Adjustment Notice**
- **Out of Stock** prevents new add-to-cart actions and invalidates existing cart quantities for that **Product Variant**
- **Low Stock** may appear as a selling signal before a **Product Variant** becomes **Out of Stock**
- The **Catalog** is exposed through the **Storefront**, but the **Storefront** is not the **Catalog** itself
- **Home** is part of the **Storefront** and acts as a major entry point into **Catalog** discovery
- **Featured Products** are highlighted within the **Storefront**, but they do not define catalog taxonomy
- **Best Sellers** may be shown in the **Storefront**, but they are conceptually distinct from **Featured Products**
- **New Arrivals** may be shown in the **Storefront**, but they are conceptually distinct from both **Featured Products** and **Best Sellers**
- **Flash Sale** may be shown in the **Storefront**, but it represents a timeboxed campaign rather than a generic product badge
- A **Sale Price** is the effective purchase price, while **List Price** is the comparison baseline
- An **Order Total** is committed when the **Order** is created and should not drift with later catalog changes
- Each **Order Line** should preserve its own **Order Line Unit Price** so the committed purchase calculation remains explainable
- **Cart Pricing** remains dynamic until checkout succeeds, while **Order Pricing** is the committed snapshot created with the **Order**
- **Price Revalidation** may update **Cart Pricing**, and any resulting price change should surface a **Price Change Notice**
- An **Order** may only be created from a **Revalidated Checkout State**
- A **Submit Revalidation Gate** prevents order creation from stale checkout data when price or stock changes are detected at submit time
- **Post-Order Cart Clear** empties committed Cart Lines once a successful **Checkout** creates an **Order**
- The **Checkout Completion Point** occurs at **Order Confirmation** after successful order creation
- The **Post-Confirmation Primary CTA** should take the Customer from **Order Confirmation** to the specific **Order Detail** for the newly created **Order**
- A successful **Checkout** creates an **Order**
- An **Order Confirmation** presents the result of a newly created **Order**, but it is not itself an **Order** state
- A **Store Operator** handles routine operational work, while **Admin** is reserved for higher-privilege system control
- A **Product** may offer one or more **Product Variant**s, and Customers purchase a **Product Variant**, not an abstract **Product**
- **Variant Stock** belongs to a **Product Variant**, even if a **Product** exposes a higher-level availability signal
- A **Category** groups **Product**s within the catalog taxonomy and is distinct from promotional labeling
- A **Promotional Badge** may be attached to a **Product**, but it does not change the **Category**
- A **Cart Line** becomes an **Order Line** only when successful **Checkout** creates an **Order**
- A successful **Checkout** uses a chosen **Payment Method**, and the MVP currently supports **Cash on Delivery (COD)**
- **Checkout** collects **Fulfillment Details** before creating an **Order**
- An **Order** has an **Order Status**, but the repository has not yet fixed the status vocabulary
- **Order History** contains created **Order**s only, not abandoned **Checkout** attempts or **Cart** state
- **Order Detail** presents one created **Order** from **Order History** or operational lookup
- A **Customer Account** may contain **Profile** information, but **Profile** is not the whole **Customer Account**
- An **Address Book** belongs to a **Customer Account**, while **Fulfillment Details** belong to a specific **Checkout** and resulting **Order**
- An **Order** should preserve a **Fulfillment Snapshot** created from the **Fulfillment Details** submitted during **Checkout**
- **Search** and **Category Discovery** are both discovery behaviors, but they are driven by different customer intents
- A **Filter** refines results within **Search** or **Category Discovery**, but it is not itself a discovery mode
- **Sort** reorders the visible result set, while **Filter** changes which Products remain visible

## Example dialogue

> **Dev:** "Tôi cần cập nhật file nào trước khi đổi scope checkout?"
> **Domain expert:** "Cập nhật bản tiếng Việt là **Source of Truth** trước, rồi mới đồng bộ bản dịch tiếng Anh. Nếu task đang chạy, sửa **Active Plan**; nếu plan cũ đã xong thì chỉ cập nhật trạng thái cuối."

## Flagged ambiguities

- "plan" was used to mean both a live execution document and a historical record — resolved: use **Active Plan**, **Completed Plan**, or **Superseded Plan** explicitly.
- "docs" was used to mean both human-facing documentation and agent workflows — resolved: use **Human-First Docs** for the root documentation layer and separate agent-oriented material by folder.
- numbered filenames were being used as if they expressed importance and permanence — resolved: prefer **Stable Filename**s once documents are grouped by **Document Category**.
- "agent docs" was used to mean both machine-facing settings and human workflow guides — resolved: separate **Agent Configuration** from **Playbook** documentation.
- "superpowers" was acting like a document category even though it only describes tooling provenance — resolved: treat it as a **Legacy Tooling Label** instead.
- the docs root had no clear human entry point — resolved: add a **Documentation Map** in `docs/README.vi.md`.
- document trust rules were scattered across prose and filenames — resolved: standardise **Documentation Metadata** at the top of important documents.
- metadata formatting was inconsistent between files — resolved: use **Frontmatter** instead of ad-hoc Markdown headers for standard metadata.
- metadata structure could have fragmented by document type — resolved: use a shared **Core Schema** with category-specific **Extension Field**s.
- the minimum metadata set was unclear — resolved: every important document must include the **Core Metadata Fields** `title`, `status`, `audience`, `language`, `language_role`, `owner`, and `last_updated`.
- document responsibility could have drifted when people changed roles — resolved: the `owner` metadata field records an **Owner Role**, not an individual.
- document lifecycle labels could have drifted into synonyms like "done" or "obsolete" — resolved: constrain `status` to the **Status Vocabulary** `active`, `completed`, `superseded`.
- document readership labels could have drifted into vague variants like "internal" or "everyone" — resolved: constrain `audience` to the **Audience Vocabulary** `human`, `agent`, `mixed`.
- language-role labels could have drifted into ambiguous variants like "primary" or "localized copy" — resolved: constrain `language_role` to the **Language Role Vocabulary** `source-of-truth`, `translation`.
- language labels could have drifted into inconsistent codes like "vn" or "en-US" — resolved: constrain `language` to the **Language Vocabulary** `vi`, `en`.
- roadmap and backlog were both being treated as execution material — resolved: classify **Product Roadmap** under product docs and **Priority Backlog** under plans.
- technical stack and implementation rules were at risk of being mixed with product docs — resolved: classify **Technical Baseline** and **Implementation Convention** under architecture docs.
- MVP intent was at risk of being mixed with architecture and execution material — resolved: classify **MVP Overview** under product docs.
- workflow instructions and skill catalogs were at risk of being mixed with project docs — resolved: classify **Playbook Guide** and **Skill Inventory** under playbooks.
- the premium upgrade document was mixing experiential intent with planning language — resolved: classify it as an **Experience Upgrade Spec** under specs.
- a one-shot documentation move would create unnecessary link and maintenance risk — resolved: use **Phased Migration** for the restructure.
- removing old doc paths immediately would create unnecessary churn during migration — resolved: keep a **Temporary Stub** at old paths until the full documentation restructure is complete, then delete the stubs.
- plans and specs needed different filename stability rules — resolved: use **Dated Plan Filename**s for plans and **Stable Spec Filename**s for specs.
- translating every document into English would create unnecessary maintenance cost — resolved: use a **Selective Translation Policy** where only chosen documents require EN translations.
- English translation coverage was too broad by default — resolved: apply the **Translation Coverage Rule** where `README`, `product`, and `architecture` normally have EN, while other categories translate selectively.
- ADRs were at risk of being narrowed to technical architecture only — resolved: keep a **Repository ADR Log** at `docs/adr/` for cross-cutting repository decisions.
- the root glossary could have split between documentation language and product language too early — resolved: use a **Combined Context** with explicit sections for both.
- "shopper" could have been used as the canonical buyer term — resolved: use **Customer** as the domain term and reserve **Shopper Persona** for UX-oriented discussion.
- authentication language and commerce language could have been collapsed into one actor — resolved: use **User** for identity/auth concerns and **Customer** for commerce behavior.
- checkout access rules could have been left ambiguous — resolved: use **Authenticated Checkout**, where browsing and carting may start anonymously but checkout requires a signed-in **User**.
- login could have discarded purchase intent gathered before authentication — resolved: use **Cart Continuity** so the pre-login **Cart** survives sign-in.
- cart reconciliation after login could have been arbitrary — resolved: use **Cart Merge**, add quantities for the same **Product Variant**, and apply **Quantity Revalidation** against **Variant Stock**.
- over-stocked cart quantities could have been handled inconsistently — resolved: use **Quantity Clamp** to reduce to the highest valid quantity and show a **Stock Adjustment Notice** to the customer.
- out-of-stock handling could have been deferred until checkout too late — resolved: treat **Out of Stock** as non-purchasable for new add-to-cart actions and force invalid cart lines to be removed or zeroed with notice.
- scarcity messaging could have been confused with a hard inventory stop — resolved: use **Low Stock** as a derived selling signal and reserve **Out of Stock** for the non-purchasable condition.
- sellable offering and customer-facing interface could have been conflated — resolved: use **Catalog** for the sellable domain and **Storefront** for the customer-facing experience surface.
- the homepage could have been treated as a separate marketing property — resolved: use **Home** as the primary entry surface within the **Storefront**.
- highlighted merchandising sets could have been confused with taxonomy or sales-performance data — resolved: use **Featured Products** for curated storefront emphasis rather than for catalog structure.
- sales-derived collections could have been confused with curated collections — resolved: use **Best Sellers** for sales-performance-driven sets and keep them distinct from **Featured Products**.
- recency-derived collections could have been confused with curated or sales-derived collections — resolved: use **New Arrivals** for recently added catalog sets and keep them distinct from **Featured Products** and **Best Sellers**.
- campaign-level urgency could have been confused with a simple discount label — resolved: use **Flash Sale** for timeboxed promotional campaigns and keep it distinct from generic sale badging.
- discounted display pricing could have been treated as non-binding decoration — resolved: use **Sale Price** for the effective purchase price and **List Price** for the pre-discount reference price.
- committed purchase amounts could have been recomputed from later catalog state — resolved: use **Order Total** as the stored amount agreed at order creation time.
- committed order totals could have lacked line-level pricing evidence — resolved: store **Order Line Unit Price** on each **Order Line** at order creation time.
- cart and order prices could have been treated with the same stability rules — resolved: use **Cart Pricing** as dynamic and revalidated, and **Order Pricing** as the committed snapshot.
- promotion changes could have repriced carts invisibly — resolved: apply **Price Revalidation** to **Cart Pricing** and show a **Price Change Notice** before checkout completes.
- price-change handling could have required unnecessary extra acknowledgement steps — resolved: show a **Price Change Notice**, refresh to a **Revalidated Checkout State**, and allow order creation only from that updated state without a separate acknowledgement flow.
- submit-time stock or price changes could have created orders from stale customer intent — resolved: enforce a **Submit Revalidation Gate**, reject the current submit, refresh to the **Revalidated Checkout State**, and require a fresh submit.
- post-purchase cart state could have remained ambiguous — resolved: apply **Post-Order Cart Clear** after successful order creation so committed lines do not remain in the Cart.
- the end of checkout could have remained implicit after order creation — resolved: use **Order Confirmation** as the **Checkout Completion Point**.
- the next step after order confirmation could have been too generic — resolved: use a **Post-Confirmation Primary CTA** to take the customer to the newly created **Order Detail**, with broader order browsing left secondary.
- cart behaviour and checkout behaviour could have been collapsed into one concept — resolved: use **Cart** for pre-order item management and **Checkout** for order submission.
- "order" could have been used for pre-submit checkout data — resolved: an **Order** exists only after successful checkout submission.
- "order confirmation" could have been mistaken for a lifecycle status — resolved: use **Order Confirmation** for the post-submit customer-facing artifact, not for the order's core business state.
- "admin" could have been used as the default label for all backoffice users — resolved: use **Store Operator** for routine operations and reserve **Admin** for higher-privilege system or owner-level control.
- "product variant" could have been treated as a UI-only detail — resolved: use **Product Variant** as a core domain concept distinct from **Product**.
- stock could have been modeled at the wrong level — resolved: use **Variant Stock** at the **Product Variant** level, with any product-level availability treated as a derived signal.
- category could have been treated as a marketing label rather than a catalog structure — resolved: use **Category** as the canonical catalog taxonomy.
- promotional labels like `sale` or `best-seller` could have been confused with catalog taxonomy — resolved: use **Promotional Badge** for marketing labels and keep them distinct from **Category**.
- line items before and after purchase could have been conflated — resolved: use **Cart Line** before submission and **Order Line** after the **Order** is created.
- COD could have been framed as a temporary workaround rather than a first-class business choice — resolved: treat **Cash on Delivery (COD)** as the MVP's supported **Payment Method**.
- shipping information could have been reduced to just an address field — resolved: use **Fulfillment Details** for the full delivery-information concept collected during **Checkout**.
- order lifecycle language could have been over-specified too early — resolved: keep **Order Status** as a concept now, but defer the exact enum until the operational workflow is designed clearly.
- order history could have been polluted with pre-submit activity — resolved: use **Order History** only for successfully created **Order**s.
- "order detail" could have been mistaken for a separate order type — resolved: use **Order Detail** as the detailed view of one created **Order**.
- "profile" could have been used as the umbrella term for the signed-in customer area — resolved: use **Customer Account** for the whole post-login space and **Profile** for one subsection within it.
- saved addresses and checkout-time delivery data could have been conflated — resolved: use **Address Book** for reusable account data and **Fulfillment Details** for checkout/order-specific delivery information.
- order delivery data could have been treated as a live reference to account addresses — resolved: store a **Fulfillment Snapshot** on the **Order** at purchase time.
- search-led discovery and taxonomy-led browsing could have been collapsed into one concept — resolved: distinguish **Search** from **Category Discovery**.
- refinement controls could have been tied to only one discovery flow — resolved: use **Filter** as a shared refinement mechanism across **Search** and **Category Discovery**.
- sorting and filtering could have been collapsed into one control concept — resolved: use **Sort** for result ordering and **Filter** for result refinement.
