import React from 'react';
import { Check } from 'lucide-react';
import './Pricing.css';

const plans = [
  {
    name: 'Community',
    price: 'Free',
    features: ['3 active workflows', '100 AI calls/day', 'Community Support'],
    cta: 'Get Started',
    link: 'https://github.com/MyysticOwl/undergrowth/releases',
    primary: false
  },
  {
    name: 'Starter',
    price: '$49',
    period: '/year',
    features: ['10 active workflows', '500 AI calls/day', 'Email Support'],
    cta: 'Choose Starter',
    link: 'https://undergrowth.lemonsqueezy.com/checkout/buy/5ecf0b98-6a7a-457e-b119-0a358e710d92?embed=1',
    primary: false
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/year',
    features: ['Unlimited workflows', 'Unlimited AI', 'Priority Support'],
    cta: 'Choose Pro',
    link: 'https://undergrowth.lemonsqueezy.com/checkout/buy/5ecf0b98-6a7a-457e-b119-0a358e710d92?embed=1',
    primary: true
  },
  {
    name: 'Team',
    price: '$249',
    period: '/year',
    features: ['5 seats', 'RBAC', 'Audit logs', 'Dedicated Support'],
    cta: 'Choose Team',
    link: 'https://undergrowth.lemonsqueezy.com/checkout/buy/5ecf0b98-6a7a-457e-b119-0a358e710d92?embed=1',
    primary: false
  },
  {
    name: 'Enterprise',
    price: '$999+',
    period: '/year',
    features: [
      'Everything in Team',
      'SSO/OIDC integration (Coming Soon)',
      'Volume licensing',
      'Custom plugin development ($200/hour)'
    ],
    cta: 'Contact Sales',
    link: 'mailto:sales@undergrowth.io',
    primary: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Simple Pricing. No Surprises.</h2>
          <p className="section-subtitle">
            Start free with Community. Upgrade when you need more power. $0 Usage Fees on all plans.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card glass-panel ${plan.primary ? 'primary' : ''}`}>
              {plan.primary && <div className="popular-badge">Most Popular</div>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.price}
                {plan.period && <span className="period">{plan.period}</span>}
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <Check size={18} className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={plan.link}
                className={`btn-plan ${plan.primary ? 'btn-primary' : 'btn-secondary'}`}
                target={plan.link.startsWith('http') ? "_blank" : "_self"}
                rel="noopener noreferrer"
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
